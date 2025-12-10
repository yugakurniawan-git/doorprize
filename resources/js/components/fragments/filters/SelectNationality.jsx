import { getSelectOptions } from "../../../services/neofeeder.services";
import SelectAsyncPaginate from "../../elements/input/SelectAsyncPaginate";

function SelectNationality({ params, setParams, ...props }) {
  return (
    <SelectAsyncPaginate
      required={true}
      label="Select Nationality"
      loadOptions={(...args) =>
        getSelectOptions("GetNegara", "nama_negara", ...args, {
          order: "nama_negara asc",
        })
      }
      name="kewarganegaraan"
      getOptionValue={(option) => option.id_negara}
      getOptionLabel={(option) => option.nama_negara}
      value={
        params?.kewarganegaraan
          ? {
              id_negara: params?.kewarganegaraan || "",
              nama_negara: params?.["details[nama_negara]"] || "",
            }
          : null
      }
      onChange={(value) => {
        if (value) {
          setParams({
            ...params,
            kewarganegaraan: value?.id_negara || "",
            "details[nama_negara]": value?.nama_negara || "",
          });
        } else {
          const { kewarganegaraan, ...rest } = params;
          if (rest?.["details[nama_negara]"]) {
            delete rest["details[nama_negara]"];
          }
          setParams(rest);
        }
      }}
      {...props}
    />
  );
}

export default SelectNationality;
