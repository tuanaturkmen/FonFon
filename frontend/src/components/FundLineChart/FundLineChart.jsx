import { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";
import { getFundHistory } from "./FundLineChartService";

function FundLineChart({ code }) {

	const [data, setData] = useState([]);

	useEffect(() => {

		async function fetchData() {
			console.log("Request")
			const code = ""
			const res = await getFundHistory(code);
			if (res) {
				setData(res)
			}
		}

		fetchData();
	}, [])

  	return (
		<div>
			{/* Title */}
			<h2>{code}</h2>

			{/* LineChart */}
			<LineChart width={600} height={300} data={data}>
			<CartesianGrid stroke="#ccc" />
			<XAxis dataKey="date" />
			<YAxis />
			<Line type="monotone" dataKey="price" stroke="#4a90e2" />
			</LineChart>
		</div>
  	);
}

export default FundLineChart;
