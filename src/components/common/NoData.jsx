import { COLORS } from "../../constants/colors";

export const NoData = ({ text = "Tidak ada data yang sesuai filter." }) => (
  <div style={{ padding: 40, textAlign: "center", color: COLORS.gray500, fontSize: 14 }}>{text}</div>
);
