import SelectInput from "../../elements/input/SelectInput";

function SelectStatusNeo({ ...props }) {
  return (
    <SelectInput
      label={`Status Neo Feeder`}
      name={`neofeeder_status->synced`}
      options={[
        { value: "1", label: "Synced" },
        { value: "0", label: "Not Synced" },
      ]}
      {...props}
    />
  );
}

export default SelectStatusNeo;
