import { classesColumn } from "@/components/tables/classesColumn";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { gql } from "@urql/core";
import {
  GetClassesQuery,
  GetClassesQueryVariables,
} from "@/lib/generated/graphql/server";

const GET_CLASSES = gql(`
  query GetClasses($where: ClassWhereInput) {
    classes(where: $where) {
      id
      name
      studentCount
      capacity
      supervisors {
        name 
        surname
      }
      grade {
        name
      }
    }
  }
`);

const ClassesListPage = async ({ searchParams }: SearchParams) => {
  const { supervisorId } = await searchParams;

  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();
  const { data } = await client
    .query<
      GetClassesQuery,
      GetClassesQueryVariables
    >(GET_CLASSES, { where: { supervisorId } })
    .toPromise();

  const formattedData = data?.classes?.map((item) => ({
    ...item,
    supervisor: item.supervisors[0],
  }));

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={classesColumn}
        data={formattedData ?? []}
        accessLevel={accessLevel!}
        tableFor="class"
        title="All Classes"
        filters={{ selectCount: false }}
      />
    </div>
  );
};

export default ClassesListPage;
