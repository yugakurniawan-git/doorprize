import { api_url } from "../../../helpers";
import SelectAsyncPaginate from "../../elements/input/SelectAsyncPaginate";

function SelectStudyProgram({ params, setParams, ...props }) {
  return (
    <SelectAsyncPaginate
      label="Study Program"
      url={api_url("uais-v2", `/study-programs?sort_by=order&sort_type=asc&fields[]=id&fields[]=nama_english${params?.faculty_id ? `&faculty_id=${params?.faculty_id}` : ""}`)}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.nama_english}
      value={params?.[props.name || "study_program_id"] && {
        id: params?.[props.name || "study_program_id"] || "",
        nama_english: params?.["details[study_program_name]"] || "",
      }}
      onChange={(value) => {
        if (value) {
          setParams({
            ...params,
            [props.name || "study_program_id"]: value?.id || "",
            "details[study_program_name]": value?.nama_english || "",
          });
        } else {
          const { [props.name || "study_program_id"]: name, "details[study_program_name]": studyProgramName, ...rest } = params;
          setParams(rest);
        }
      }}
      {...props}
    />
  );
}

export default SelectStudyProgram;
