import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";
import { gradesColumn } from "@/components/tables/gradesColumn";
import { DataTable } from "@/components/tables/data-table";
import { gql } from "@urql/core";
import {
  GetGradesQuery,
  GetGradesQueryVariables,
} from "@/lib/generated/graphql/server";

const GET_GRADES = gql(`
    query GetGrades($where: GradeWhereInput) {
      grades(where: $where) {
          id
          name
          classes {
            id
            name
            studentCount
          }
      }
    }
`);

const GradesListPage = async ({ searchParams }: SearchParams) => {
  const { supervisorId } = await searchParams;

  const { accessLevel } = await getCurrentUser();
  const { client } = await createServerClient();
  const { data } = await client
    .query<
      GetGradesQuery,
      GetGradesQueryVariables
    >(GET_GRADES, { where: { supervisorId } })
    .toPromise();

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={gradesColumn}
        data={data?.grades ?? []}
        accessLevel={accessLevel!}
        title="All Grades"
        tableFor="grade"
      />
    </div>
  );
};

export default GradesListPage;
