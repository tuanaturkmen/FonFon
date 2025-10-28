import FundLineChart from "../components/FundLineChart/FundLineChart";


function HomeScreen() {
	return (
		<div style={{ display: "flex", flexDirection: "row" }}>
			<FundLineChart code={"AAK"}></FundLineChart>
    	</div>
  	);
}

export default HomeScreen;
