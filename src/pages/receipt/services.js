import { downloadAsPdf } from "../../utils/downloadAsPdf"

export const handleClickdownloadAsPdf = (receiptData) => downloadAsPdf("receiptPdf", `Receipt-${receiptData.receiptNumber}-${receiptData.donorName}.pdf`);