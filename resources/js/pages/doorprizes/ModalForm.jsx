import Modal from "../../components/elements/Modal";
import TextInput from "../../components/elements/input/TextInput";
import Button from "../../components/elements/Button";
import { useRef, useState, } from "react";
import { apiServiceDelete, apiServicePost } from "../../services/api.services";
import Swal from "sweetalert2";
import { Toast } from "../../helpers";
import TextArea from "../../components/elements/input/TextArea";
import FilePreview from "./FilePreview";

function ModalForm({ openModal, isEdit, setOpenModal, doorprize, setDoorprize, loadData }) {
  const [errorDoorprize, setErrorDoorprize] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const previewImages = useRef(null);
  const inputImages = useRef(null);

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		// Add removed image IDs to form data
		removedImageIds.forEach(imageId => {
			formData.append('remove_images[]', imageId);
		});

		const response = await apiServicePost("/api/doorprizes",formData);
		if ([200, 201].includes(response.status)) {
      loadData();
      handleCloseModal();
      Toast.fire({
        icon: 'success',
        title: isEdit ? 'Doorprize updated successfully' : 'Doorprize added successfully'
      });
		} else {
			setErrorDoorprize(response.data?.errors);
		}
	}

	async function handleDelete() {
		Swal.fire({
			title: "Are you sure?",
			text: "This action cannot be undone.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response = await apiServiceDelete(`/api/doorprizes/${doorprize.id}`);
				if (response.status == 200) {
					loadData();
          setOpenModal(false);
          setDoorprize({});
          setErrorDoorprize({});
          Toast.fire({
            icon: 'success',
            title: 'Doorprize deleted successfully'
          });
				}
			}
		});
	}

  function handleCloseModal() {
    setOpenModal(false);
    setErrorDoorprize({});
    setDoorprize({});
    setSelectedFiles([]);
    setRemovedImageIds([]);
    if (inputImages.current) {
      inputImages.current.value = null;
    }
  }

  return (
    <Modal
      show={openModal}
      size="w-xl"
      onClose={handleCloseModal}
    >
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
        encType="multipart/form-data"
      >
        <Modal.Header>{isEdit ? "Edit" : "Add"} Doorprize</Modal.Header>
        <Modal.Body>
          <input type="hidden" name="id" value={doorprize?.id || ""} />
          <input
            ref={inputImages}
            type="file"
            accept="image/*"
            name="images[]"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files);
              setSelectedFiles(files);
            }}
          />
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-3/4">
                  <TextInput
                    label="Name"
                    required={true}
                    type="text"
                    name="name"
                    value={doorprize?.name || ""}
                    placeholder="Enter Name"
                    onChange={(event) => {
                      setDoorprize({
                        ...doorprize,
                        name: event.target.value,
                      });
                      setErrorDoorprize({
                        ...errorDoorprize,
                        name: null,
                      });
                    }}
                    error={errorDoorprize?.name}
                  />
                </div>
                <div className="w-1/4">
                  <TextInput
                    label="Winners Quota"
                    required={true}
                    type="number"
                    name="winners_quota"
                    value={doorprize?.winners_quota || ""}
                    placeholder="Enter Quota Winners"
                    onChange={(event) => {
                      setDoorprize({
                        ...doorprize,
                        winners_quota: event.target.value,
                      });
                      setErrorDoorprize({
                        ...errorDoorprize,
                        winners_quota: null,
                      });
                    }}
                    error={errorDoorprize?.winners_quota}
                  />
                </div>
              </div>
              <TextArea
                label="Description"
                name="description"
                value={doorprize?.description || ""}
                placeholder="Enter Description"
                onChange={(event) => {
                  setDoorprize({
                    ...doorprize,
                    description: event.target.value,
                  });
                  setErrorDoorprize({
                    ...errorDoorprize,
                    description: null,
                  });
                }}
                error={errorDoorprize?.description}
              />
            </div>
            <div ref={previewImages} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doorprize?.images && doorprize.images
                .filter(image => !removedImageIds.includes(image.id))
                .map((image, index) => (
                <div key={`existing-${image.id}`} className="relative">
                  <a href={image.image_url} data-fancybox="gallery">
                    <img
                      src={image.image_url}
                      className="w-full h-32 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer"
                    />
                  </a>
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 duration-200 ease-in-out cursor-pointer"
                    onClick={() => {
                      setRemovedImageIds([...removedImageIds, image.id]);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}

              {selectedFiles.map((file, index) => (
                <FilePreview
                  key={`new-${index}`}
                  file={file}
                  index={index}
                  onRemove={() => {
                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                    setSelectedFiles(newFiles);
                    // Update the file input
                    const dt = new DataTransfer();
                    newFiles.forEach(file => dt.items.add(file));
                    inputImages.current.files = dt.files;
                  }}
                />
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className={`flex justify-between items-center gap-2`}>
          {isEdit && (
            <Button
              type="button"
              bg="bg-black"
              onClick={handleDelete}
              children="Delete"
            />
          )}
          <div className="flex gap-2 ms-auto">
            <Button
              type="button"
              bg="bg-gray-500"
              onClick={handleCloseModal}
              children="Cancel"
            />
            <Button
              type="button"
              bg="bg-rise"
              color={"text-black"}
              hover={"hover:bg-yellow-700 hover:text-white cursor-pointer"}
              onClick={() => inputImages.current.click()} children="Add Images"
            />
            <Button
              type="submit"
              children={isEdit ? "Update" : "Save"}
            />
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalForm;
