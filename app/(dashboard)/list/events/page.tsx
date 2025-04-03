import { eventsColumn } from '@/components/tables/eventsColumn';
import { DataTable } from "@/components/ui/data-table";
import prisma from '@/lib/prisma';
import { SearchParams } from '@/types';
import { Prisma } from '@prisma/client';


const EventsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.EventWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' }
            break;
          default:
            break;
        }
      }
    }
  }

  const events = await prisma.event.findMany({
    where: query,
    include: {
      class: { select: { name: true } }
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="event" columns={eventsColumn} data={events} filterBy="title" />
    </div>
  );
};

export default EventsListPage;