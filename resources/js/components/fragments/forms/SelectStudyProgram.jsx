import { api_url } from "../../../helpers";
import SelectAsyncPaginate from "../../elements/input/SelectAsyncPaginate";

function SelectStudyProgram({ form, setForm, errorForm, setErrorForm , editable, ...props }) {
  return (
    <SelectAsyncPaginate
      label="Study Program"
      isDisabled={!editable}
      required={true}
      name="study_program_id"
      url={api_url("uais-v2", "/study-programs?fields=id,nama_english&sort_by=order&sort_type=asc")}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.nama_english}
      value={
        form?.study_program_id
        ? {
            id: form?.study_program_id,
            nama_english: form?.study_program?.nama_english,
          }
        : null
      }
      onChange={(value) => {
        setForm({
          ...form,
          study_program_id: value?.id,
          study_program: value,
        });
        setErrorForm({
          ...errorForm,
          study_program_id: null,
        });
      }}
      error={errorForm?.study_program_id}
      {...props}
    />
  );
}

export default SelectStudyProgram;
