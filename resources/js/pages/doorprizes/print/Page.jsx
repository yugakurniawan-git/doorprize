import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiService } from "../../../services/api.services";
import QRCode from "qrcode";
import "../../../../css/print.css";
import Loading from "../../../components/elements/Loading";

function Page () {
  const { id } = useParams();
  const [doorprize, setDoorprize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    document.title = "Print Doorprize - Doorprizes Management";
    getDoorprize(true);
  }, [id]);

  useEffect(() => {
    if (doorprize && doorprize.winners && doorprize.winners.length > 0) {
      generateQRCodes();
      // Automatically trigger print after data is loaded
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [doorprize]);

  async function generateQRCodes() {
    try {
      const qrPromises = doorprize.winners.map(async (winner) => {
        const url = `${window.location.origin}/#/doorprize-winners/${winner.id}`;
        const qrDataUrl = await QRCode.toDataURL(url);
        return {
          winnerId: winner.id,
          code: winner.code,
          qrCode: qrDataUrl
        };
      });

      const generatedQRCodes = await Promise.all(qrPromises);
      setQrCodes(generatedQRCodes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
    }
  }

  async function getDoorprize(loading = false) {
    setIsLoading(loading);
    const response = await apiService("GET", `/api/doorprizes/${id}`, {
      params: {
        include: [
          "winners:id,doorprize_id,code"
        ],
      },
    });
    setDoorprize(response.data);
    setIsLoading(false);
  }

  return (
    <>
      <div className="print-container">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div>Loading...</div>
          </div>
        ) : (
          doorprize && (
            <div>
              <div className="title">
                <h1 className="text-3xl font-bold mb-2">{doorprize.name}</h1>
                <p className="text-gray-600">{doorprize.description}</p>
              </div>

              {qrCodes.length > 0 ? (
                <div className="winners-grid">
                  {qrCodes.map((item) => (
                    <div key={item.winnerId} className="winner-card">
                      <div className="qr-section">
                        <img
                          src={item.qrCode}
                          alt={`QR Code for winner ${item.code}`}
                          style={{ width: '80px', height: '80px', marginBottom: '8px' }}
                        />
                      </div>
                      <div className="winner-info">
                        <p className="text-lg font-bold mb-1">Winner Code:</p>
                        <p className="text-2xl font-mono font-bold text-blue-600 mb-2">
                          {item.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {item.winnerId}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Scan to verify
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : doorprize.winners && doorprize.winners.length > 0 ? (
                <div className="flex flex-col justify-center items-center p-8">
                  <Loading/>
                  <p className="text-lg">Generating QR codes...</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500 text-lg">No winners found for this doorprize.</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default Page;
