import { eventsColumn } from "@/components/tables/eventsColumn";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { DataTable } from "@/components/tables/data-table";
import { gql } from "@urql/core";

const GET_EVENTS = gql(`
    query GetEvents {
        events {
          id
          title
          description
          startTime
          endTime
          updatedAt
          grade {
            name
          }
        }
    }
`);

const EventsListPage = async () => {
  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();

  const { data } = await client.query<any, any>(GET_EVENTS, {}).toPromise();

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={eventsColumn}
        data={data?.events ?? []}
        accessLevel={accessLevel!}
        tableFor="event"
        title="Events"
      />
    </div>
  );
};

export default EventsListPage;
