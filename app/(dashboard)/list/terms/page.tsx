import { DataTable } from "@/components/tables/data-table";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { gql } from "@urql/core";
import { GetTermsQuery } from "@/lib/generated/graphql/server";
import { termsColumns } from "@/components/tables/termColumns";

const GET_TERMS = gql(`
    query GetTerms {
        terms {
            id
            term
            startDate
            endDate
            isCurrent
        }
    }
`);

const TermsListPage = async () => {
  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();
  const { data } = await client.query<GetTermsQuery>(GET_TERMS, {});

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={termsColumns}
        data={data?.terms ?? []}
        accessLevel={accessLevel!}
        tableFor="term"
        title="Terms"
        filters={{ selectCount: false }}
        relatedData={{ isAcademicYearForm: false }}
      />
    </div>
  );
};
export default TermsListPage;
