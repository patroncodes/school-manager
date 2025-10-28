import { subjectsColumn } from "@/components/tables/subjectsColumn";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { DataTable } from "@/components/tables/data-table";
import { gql } from "@urql/core";
import {
  GetSubjectsQuery,
  GetSubjectsQueryVariables,
} from "@/lib/generated/graphql/server";

const GET_SUBJECTS = gql(`
    query GetSubjects{
        subjects {
            id
            name
            teachers {
              id
                teacher {
                    name 
                    surname
                }
            }
        }
    }
`);

const SubjectsListPage = async () => {
  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();
  const { data } = await client.query<
    GetSubjectsQuery,
    GetSubjectsQueryVariables
  >(GET_SUBJECTS, {});

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={subjectsColumn}
        data={data?.subjects ?? []}
        accessLevel={accessLevel!}
        title="Subjects"
        tableFor="subject"
        filters={{ selectCount: false }}
      />
    </div>
  );
};

export default SubjectsListPage;
