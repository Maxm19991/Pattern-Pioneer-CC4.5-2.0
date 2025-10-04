const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

interface MailerliteSubscriber {
  email: string;
  fields?: {
    name?: string;
    [key: string]: string | undefined;
  };
  groups?: string[];
  status?: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
}

export async function addSubscriberToMailerlite(
  email: string,
  source: string = 'free_download'
): Promise<{ success: boolean; error?: string }> {
  if (!MAILERLITE_API_KEY) {
    console.error('Mailerlite API key not configured');
    return { success: false, error: 'Mailerlite not configured' };
  }

  try {
    const subscriberData: MailerliteSubscriber = {
      email,
      status: 'active',
    };

    // Add to group if configured
    if (MAILERLITE_GROUP_ID) {
      subscriberData.groups = [MAILERLITE_GROUP_ID];
    }

    // Add custom field for tracking source
    subscriberData.fields = {
      source,
    };

    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const data = await response.json();

    if (!response.ok) {
      // If subscriber already exists, that's okay
      if (response.status === 422 || data.message?.includes('already exists')) {
        console.log('Subscriber already exists in Mailerlite:', email);

        // Try to add to group if they exist but aren't in the group
        if (MAILERLITE_GROUP_ID) {
          await addExistingSubscriberToGroup(email);
        }

        return { success: true };
      }

      console.error('Mailerlite API error:', data);
      return { success: false, error: data.message || 'Failed to add subscriber' };
    }

    console.log('Successfully added subscriber to Mailerlite:', email);
    return { success: true };
  } catch (error: any) {
    console.error('Mailerlite integration error:', error);
    return { success: false, error: error.message };
  }
}

async function addExistingSubscriberToGroup(email: string): Promise<void> {
  if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
    return;
  }

  try {
    // First, get the subscriber ID by email
    const searchResponse = await fetch(
      `${MAILERLITE_API_URL}/subscribers?filter[email]=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: 'application/json',
        },
      }
    );

    const searchData = await searchResponse.json();

    if (searchData.data && searchData.data.length > 0) {
      const subscriberId = searchData.data[0].id;

      // Add subscriber to group
      await fetch(`${MAILERLITE_API_URL}/subscribers/${subscriberId}/groups/${MAILERLITE_GROUP_ID}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          Accept: 'application/json',
        },
      });

      console.log('Added existing subscriber to group:', email);
    }
  } catch (error) {
    console.error('Error adding subscriber to group:', error);
    // Don't throw - this is a non-critical operation
  }
}
