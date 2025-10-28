import { DataTable } from "@/components/tables/data-table";
import { createServerClient, getCurrentUser } from "@/lib/serverUtils";
import { gql } from "@urql/core";
import { GetAcademicYearsQuery } from "@/lib/generated/graphql/server";
import { termsColumns } from "@/components/tables/termColumns";

const GET_ACADEMIC_YEARS = gql(`
    query GetAcademicYears {
        academicYears {
            id
            year
            startDate
            endDate
            isCurrent
        }
    }
`);

const AcademicYearsListPage = async () => {
  const { accessLevel } = await getCurrentUser();

  const { client } = await createServerClient();
  const { data } = await client.query<GetAcademicYearsQuery>(
    GET_ACADEMIC_YEARS,
    {},
  );

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={termsColumns}
        data={data?.academicYears ?? []}
        accessLevel={accessLevel!}
        tableFor="academic-year"
        title="Academic Years"
        filters={{ selectCount: false }}
        relatedData={{ isAcademicYearForm: true }}
      />
    </div>
  );
};
export default AcademicYearsListPage;
