import { examsColumn } from "@/components/tables/examsColumn";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { gql } from "@urql/core";
import { DataTable } from "@/components/tables/data-table";
import {
  GetExamsQuery,
  GetExamsQueryVariables,
} from "@/lib/generated/graphql/server";

const GET_EXAMS = gql(`
  query GetExams($filter: ExamFilter) {
    exams(filter: $filter) {
      id
      date
      startTime
      endTime
      type
      maxScore
      term {
        id term
      }
      grade {
        id name
      }
      subject {
        id name
      }
    }
  }
`);

const ExamsListPage = async () => {
  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();

  const { data } = await client
    .query<GetExamsQuery, GetExamsQueryVariables>(GET_EXAMS, {})
    .toPromise();

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={examsColumn}
        data={data?.exams ?? []}
        accessLevel={accessLevel!}
        tableFor="exam"
        title="Exams"
        filters={{ selectCount: false }}
      />
    </div>
  );
};

export default ExamsListPage;
