import { useContext, useEffect, useRef } from "react";
import { DarkModeContext } from "../../../context/DarkMode";
import Modal from "../../../components/elements/Modal";
import Button from "../../../components/elements/Button";

// Simple confetti animation using canvas
function Confetti() {
	const canvasRef = useRef(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let W = window.innerWidth, H = 400;
		canvas.width = W;
		canvas.height = H;
		let particles = [];
		for (let i = 0; i < 80; i++) {
			particles.push({
				x: Math.random() * W,
				y: Math.random() * H,
				r: Math.random() * 6 + 4,
				d: Math.random() * 80,
				color: `hsl(${Math.random() * 360}, 80%, 60%)`,
				tilt: Math.random() * 10 - 10,
				tiltAngle: 0,
			});
		}
		function draw() {
			ctx.clearRect(0, 0, W, H);
			particles.forEach((p, i) => {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
				ctx.fillStyle = p.color;
				ctx.fill();
			});
			update();
		}
		function update() {
			particles.forEach((p, i) => {
				p.y += Math.cos(p.d) + 2 + p.r / 2;
				p.x += Math.sin(p.d) * 2;
				p.d += 0.01;
				if (p.y > H) {
					particles[i] = {
						...p,
						x: Math.random() * W,
						y: -10,
						color: `hsl(${Math.random() * 360}, 80%, 60%)`,
					};
				}
			});
		}
		let anim;
		function loop() {
			draw();
			anim = requestAnimationFrame(loop);
		}
		loop();
		return () => cancelAnimationFrame(anim);
	}, []);
	return (
		<canvas ref={canvasRef} style={{
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: 600,
			pointerEvents: "none",
			zIndex: 10,
		}} />
	);
}

function ModalWinner({ winner, openModal, setOpenModal }) {
	const { isDarkMode } = useContext(DarkModeContext);

	function handleCloseModal() {
		setOpenModal(false);
	}

	// Trophy SVG
	const Trophy = (
		<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="32" fill="#FFD700"/>
			<path d="M20 24c0-6.627 5.373-12 12-12s12 5.373 12 12v6c0 6.627-5.373 12-12 12s-12-5.373-12-12v-6z" fill="#FFF8DC"/>
			<rect x="26" y="44" width="12" height="8" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
			<rect x="28" y="52" width="8" height="4" rx="1" fill="#B8860B"/>
			<path d="M20 30c-4 0-6-4-6-8" stroke="#B8860B" strokeWidth="2"/>
			<path d="M44 30c4 0 6-4 6-8" stroke="#B8860B" strokeWidth="2"/>
		</svg>
	);

	return (
		<Modal show={openModal} onClose={handleCloseModal} size="w-2xl">
			<div className="relative">
				<Confetti />
				<form className="mb-0 relative z-20">
					<Modal.Body>
						<div className="flex flex-col items-center gap-2">
							<span className="block mx-auto">{Trophy}</span>
							<span className="text-2xl font-extrabold text-yellow-500 drop-shadow-lg tracking-wide animate-bounce">
								Congratulations!
							</span>
						</div>
						<div
							className={`mb-8 text-center w-full flex flex-col items-center ${
								isDarkMode ? "text-white" : "text-gray-800"
							}`}
						>
							<p className="text-xl font-bold mt-2 mb-2 text-yellow-600 animate-pulse">
								You are a winner of the
								<span className="font-extrabold text-yellow-700 ml-2">
									{winner.doorprize?.name || "doorprize"}
								</span>
								!
							</p>
							<p className="text-base mb-4 text-gray-500">
								Please check your prize below and follow the instructions to claim it.
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
												className={`relative w-full max-w-xs shadow-xl rounded-lg bg-white/80 p-4 ${
													isLastAndOdd ? "md:col-span-2 md:justify-self-center" : ""
												}`}
												style={{ border: '2px solid #FFD700' }}
											>
												<a href={image.image_url} data-fancybox="gallery">
													<img
														src={image.image_url}
														className="w-full h-60 object-cover rounded hover:opacity-80 duration-200 ease-in-out cursor-pointer border-4 border-yellow-300"
														alt="Winner Prize"
													/>
												</a>
											</div>
										);
									})}
							</div>
						</div>
						{/* close button modal */}
						<div className="flex justify-center">
							<Button 
								onClick={handleCloseModal}
								bg={`bg-rise`}
								hover={`hover:bg-yellow-700 cursor-pointer`}
							>
								Close
							</Button>
						</div>
					</Modal.Body>
				</form>
			</div>
		</Modal>
	);
}

export default ModalWinner;