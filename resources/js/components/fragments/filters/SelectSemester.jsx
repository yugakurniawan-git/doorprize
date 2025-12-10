import moment from "moment";
import { getSelectOptions } from "../../../services/neofeeder.services";
import SelectAsyncPaginate from "../../elements/input/SelectAsyncPaginate";
import { lang } from "../../../helpers";

function SelectSemester({ params, setParams, name = "id_semester", label, ...props }) {
  return (
    <SelectAsyncPaginate
      label={label || "Semester"}
      loadOptions={(...args) => getSelectOptions("GetSemester", `(id_tahun_ajaran > 2020 AND id_tahun_ajaran <= ${moment().year()}) AND nama_semester`, ...args, {order: "id_semester desc"})}
      name={name}
      getOptionValue={(option) => option.id_semester}
      getOptionLabel={(option) => lang(option.nama_semester)}
      value={params?.[name] ? {
        id_semester: params?.[name],
        nama_semester: params?.[`details[${name}]`],
      } : null}
      onChange={(value) => {
        if (value) {
          setParams({
            ...params,
            [name]: value?.id_semester,
            [`details[${name}]`]: value?.nama_semester,
          });
        } else {
          const { [name]: idSemester, [`details[${name}]`]: detailsIdSemester, ...rest } = params;
          setParams(rest);
        }
      }}
      {...props}
    />
  );
}

export default SelectSemester;
