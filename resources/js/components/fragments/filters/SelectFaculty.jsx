import { useState } from "react";
import SelectAsyncPaginate from "../../elements/input/SelectAsyncPaginate";
import { api_url } from "../../../helpers";

function SelectFaculty({ params, setParams, ...props }) {
  const [cacheUniq, setCacheUniq] = useState(Date.now());
  return (
    <SelectAsyncPaginate
      label="Faculty"
      url={api_url("uais-v2", "/faculties?fields[]=id&fields[]=nama_fakultas")}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.nama_fakultas}
      isClearable={true}
      value={params?.faculty_id ? {
        id: params?.faculty_id || "",
        nama_fakultas: params?.["details[nama_fakultas]"] || "",
      } : null}
      cacheUniqs={[cacheUniq]}
      onMenuOpen={() => setCacheUniq(Date.now())}
      onChange={(value) => {
        if (value) {
          setParams({
            ...params,
            faculty_id: value?.id || "",
            "details[nama_fakultas]": value?.nama_fakultas || "",
          });
        } else {
          const { faculty_id, ...rest } = params;
          if (rest?.["details[nama_fakultas]"]) {
            delete rest["details[nama_fakultas]"];
          }
          setParams(rest);
        }
      }}
      {...props}
    />
  );
}

export default SelectFaculty;
