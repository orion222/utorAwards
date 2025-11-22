import { useState, useEffect, useRef } from "react";
import QRCodeGenerator from "qrcode";

export default function useQRCode(data, options = {}) {
  const canvasRef = useRef();
  const [qrCodeDataURL, setQrCodeDataURL] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const defaultOptions = {
    width: 256,
    margin: 2,
    color: {
      dark: "#232715",
      light: "#FCFEFB",
    },
    ...options,
  };

  const generateQRCode = async () => {
    if (!data || !canvasRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const jsonString = JSON.stringify(data);

      await QRCodeGenerator.toCanvas(
        canvasRef.current,
        jsonString,
        defaultOptions,
      );

      const dataURL = await QRCodeGenerator.toDataURL(
        jsonString,
        defaultOptions,
      );
      setQrCodeDataURL(dataURL);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = (filename = "qrcode.png") => {
    if (qrCodeDataURL) {
      const link = document.createElement("a");
      link.download = filename;
      link.href = qrCodeDataURL;
      link.click();
      return true;
    }
    return false;
  };

  const copyQRData = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      return true;
    } catch (err) {
      console.error("Failed to copy QR data:", err);
      return false;
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [JSON.stringify(data)]);

  return {
    canvasRef,
    qrCodeDataURL,
    isGenerating,
    QRerror: error,
    generateQRCode,
    downloadQRCode,
    copyQRData,
  };
}
