import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryVoronoiContainer,
} from "victory";
import {
  MonetizationOnIcon,
  SchoolIcon,
  GroupsIcon,
  FaceRetouchingNaturalIcon,
} from "../common/icons";
import { setOverViewData } from "../../redux/actions";

function ViewAll() {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store);

  const { instructorTotal, studentTotal, userTotal, revenue, chart } =
    store.app?.overview || {};

  const pieData = useMemo(() => {
    const student = Math.floor((studentTotal / userTotal) * 100, 0) || 0;
    const instructor =
      Math.floor((instructorTotal / userTotal) * 100, 0) || 100;
    const others = 100 - instructor - student;
    return [
      { x: `${instructor}%`, y: instructor },
      { x: `${student}%`, y: student },
      { x: `${others}%`, y: others },
    ];
  }, [store.app?.overview]);

  const itemList = [
    {
      title: "Tổng số người dùng",
      quantity: userTotal,
      Icon: GroupsIcon,
      color: "#C2EAD2",
      iconColor: "#44C483",
    },
    {
      title: "Tổng số học sinh",
      quantity: studentTotal,
      Icon: SchoolIcon,
      color: "#CDE2EE",
      iconColor: "#94C5E7",
    },

    {
      title: "Tổng số giảng viên",
      quantity: instructorTotal,
      Icon: FaceRetouchingNaturalIcon,
      color: "#FFE9B3",
      iconColor: "#E2D168",
    },
    {
      title: "Doanh thu",
      quantity: `${revenue}$`,
      Icon: MonetizationOnIcon,
      color: "#E9D8D7",
      iconColor: "#B75B6C",
    },
  ];

  useEffect(() => {
    dispatch(setOverViewData());
  }, []);

  const StyledPoint = styled.circle`
    fill: ${(props) => props.color};
  `;

  const colors = ["#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94"];

  const ScatterPoint = ({ x, y, datum, min, max }) => {
    const i = React.useMemo(() => {
      return Math.floor(((datum.y - min) / (max - min)) * (colors.length - 1));
    }, [datum, min, max]);

    return <StyledPoint color={colors[i]} cx={x} cy={y} r={6} />;
  };

  const temperatures = chart.map(({ y }) => y);
  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);

  return (
    <Container>
      <Title>Thống kê E-learning</Title>
      <div className="item_wrapper">
        {itemList.map((item, index) => {
          const { Icon } = item;
          return (
            <div className="statistic" key={`${index}`}>
              <div>
                <h1 className="title">{item.title}</h1>
                <h1 className="description">{item.quantity}</h1>
              </div>
              <div
                className="icon"
                style={{ color: item.iconColor, backgroundColor: item.color }}
              >
                {<Icon style={{ width: 30, height: 30 }} />}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div style={{ display: "flex" }} className="chart-wraper">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
            className="chart-wraper__inner"
          >
            <div>
              <svg viewBox="0 0 500 500" width={500} height={500}>
                <VictoryPie
                  colorScale={["#E2D168", "#94C5E7", "#A6A8AA"]}
                  standalone={false}
                  width={500}
                  height={500}
                  data={pieData}
                  innerRadius={80}
                  labelRadius={100}
                  style={{
                    labels: {
                      fontSize: 20,
                      fill: "black",
                    },
                  }}
                  animate={{
                    duration: 2000,
                  }}
                />
                <circle
                  cx="250"
                  cy="250"
                  r="65"
                  fill="none"
                  stroke="#C2EAD2"
                  strokeWidth={5}
                />
                <circle
                  cx="250"
                  cy="250"
                  r="215"
                  fill="none"
                  stroke="#C2EAD2"
                  strokeWidth={5}
                />
                <VictoryLabel
                  textAnchor="middle"
                  verticalAnchor="middle"
                  x={250}
                  y={250}
                  style={{ fontSize: 30 }}
                  text="Users"
                />
              </svg>
            </div>
            <div>
              <VictoryChart
                height={500}
                width={1000}
                domain={{ y: [0, 6] }}
                animate={{ duration: 2000, easing: "bounce" }}
                containerComponent={
                  <VictoryVoronoiContainer
                    voronoiBlacklist={["redPoints"]}
                    labels={({ datum }) => `y: ${datum.y}`}
                  />
                }
                style={{
                  parent: {
                    border: "0.5px solid #ccc",
                    borderRadius: 12,
                  },
                }}
              >
                <VictoryLine
                  data={chart}
                  style={{
                    data: {
                      fillOpacity: 0.7,
                      stroke: "#c43a31",
                      strokeWidth: 5,
                    },
                  }}
                />

                <VictoryAxis
                  style={{
                    axis: { stroke: "#756f6a" },
                    tickLabels: { fontSize: 20, padding: 5, fontWeight: 700 },
                  }}
                  orientation="bottom"
                  theme={VictoryTheme.material}
                />
                <VictoryAxis
                  orientation="top"
                  label="Số lượng học sinh đăng kí khóa học theo từng tháng"
                  style={{
                    axis: { stroke: "#C2EAD2" },
                    axisLabel: { fontSize: 20, padding: 20, fontWeight: 700 },
                    // grid: {
                    //   stroke: ({ tick }) => "#44C483",
                    // },
                    ticks: { stroke: "#C2EAD2", size: 5 },
                    tickLabels: { fontSize: 15, padding: 5 },
                  }}
                  tickFormat={() => ""}
                />
                <VictoryAxis
                  style={{
                    axis: { stroke: "#756f6a" },
                    axisLabel: { fontSize: 20, padding: 30 },
                    // grid: {
                    //   stroke: ({ tick }) => "#44C483",
                    // },
                    tickLabels: { fontSize: 20, padding: 5, fontWeight: 700 },
                  }}
                  dependentAxis
                  orientation="right"
                  theme={VictoryTheme.material}
                />
                <VictoryScatter
                  data={chart}
                  dataComponent={<ScatterPoint min={min} max={max} />}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ViewAll;

const Wrap = styled.div`
  display: flex;
  flex-nowrap: wrap;
  background: white;
  height: 80%;
  text-align: center;
  justify-content: space-around;
  padding-top: 100px;
`;
const Container = styled.div`
  padding: 20px 50px;
  overflow: scroll;
  max-height: 100vh;

  .chart-wraper {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    margin-top: 20px;
    padding: 20px;
    border-radius: 12px;

    &__inner {
      display: flex;
      justify-content: space-between;
      flex-wrap: "wrap";
      align-items: center;
      width: 100%;
    }
  }

  .item_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 20px -15px;

    .statistic {
      padding: 40px 30px;
      border-radius: 12px;
      justify-content: space-between;
      display: flex;
      align-items: center;
      width: 23%;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;
      min-width: 300px;
      .icon {
        padding: 10px 20px;
        background: red;
        border-radius: 8px;
        justify-content: center;
        display: flex;
        align-items: center;
      }

      .title {
        font-size: 25px;
        font-weight: "700";
      }
      .description {
        margin-top: 20px;
        font-size: 40px;
        font-weight: "700";
        margin: 0;
      }
    }
  }
`;
const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 0px 8px;
  padding: 20px 20px;
  border-radius: 12px;
`;
