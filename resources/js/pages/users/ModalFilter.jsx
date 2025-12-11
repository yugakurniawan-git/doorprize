import Modal from "../../components/elements/Modal";
import Button from "../../components/elements/Button";
import SelectAsyncPaginate from "../../components/elements/input/SelectAsyncPaginate";

function ModalFilter({ openModal, setOpenModal, params, setParams }) {
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Filters</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-3">
          <SelectAsyncPaginate
            label="Role"
            url="/api/roles?fields[]=id&fields[]=name"
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            isMulti={true}
            value={params["roles->id:in"]
              ? params["roles->id:in"]
                  .split("|")
                  .map((id, index) => ({
                    id: id,
                    name: params["details[role_names]"]
                      ? params["details[role_names]"].split("|")[index]
                      : "",
                  }))
              : []
            }
            onChange={(selectedOption) => {
              setParams((prev) => ({
                ...prev,
                "roles->id:in": selectedOption?.map(option => option.id).join("|") || "",
                "details[role_names]": selectedOption?.map(option => option.name).join("|") || "",
              }));
            }}
            menuPlacement="top"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 999999 }) }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bg={`bg-slate-500`}
          type="button"
          onClick={() => {
            setParams({
              sort_by: "created_at",
              sort_type: "desc",
            })
          }}
        >
          Reset
        </Button>
        <Button type="button" onClick={() => setOpenModal(false)}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalFilter;
