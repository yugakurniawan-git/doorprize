import { useContext } from "react";
import { DarkModeContext } from "../../../context/DarkMode";
import Modal from "../../../components/elements/Modal";

function ModalWinner({ winner, openModal, setOpenModal }) {
	const { isDarkMode } = useContext(DarkModeContext);

	function handleCloseModal() {
		setOpenModal(false);
	}

  return (
		<Modal show={openModal} onClose={handleCloseModal} size="w-2xl">
      <form
        className="mb-0"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Modal.Header>Congratulations !</Modal.Header>
        <Modal.Body>
					<div
						className={`mb-8 text-center w-full ${
							isDarkMode ? "text-white" : "text-gray-800"
						}`}
					>
						<p className="text-lg mt-2">
							You are a winner of the{" "}
							<span className="font-semibold">
								{winner.doorprize?.name || "doorprize"}
							</span>
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 place-items-center">
							{winner.doorprize?.images &&
								winner.doorprize.images.map((image, index) => {
									const isLastAndOdd =
										index === winner.doorprize.images.length - 1 &&
										winner.doorprize.images.length % 2 === 1;
									return (
										<div
											key={index}
											className={`relative w-full max-w-xs ${
												isLastAndOdd ? "md:col-span-2 md:justify-self-center" : ""
											}`}
										>
											<a href={image.image_url} data-fancybox="gallery">
												<img
													src={image.image_url}
													className="w-full h-60 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer"
												/>
											</a>
										</div>
									);
								})}
						</div>
					</div>
        </Modal.Body>
      </form>
    </Modal>
  );
}

export default ModalWinner;