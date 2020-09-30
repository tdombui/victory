import React from "react";
import { Curve } from "Packages/victory-line";
import { VictoryBar, Bar } from "Packages/victory-bar";
import { VictoryPie, Slice } from "Packages/victory-pie";
import { VictoryLine } from "Packages/victory-line";
import { VictoryArea, Area } from "Packages/victory-area";
import { VictoryStack } from "Packages/victory-stack";
import { VictoryChart } from "Packages/victory-chart";
//import { VictoryScatter } from "Packages/victory-scatter";
import { VictoryBoxPlot } from "Packages/victory-box-plot";
import { LineSegment, Whisker, Border } from "Packages/victory-core";
import {
  accessibilityBarData,
  accessibilityBoxData,
  accessibilityAreaData,
  accessibilityPieDemo,
  //accessibilityScatterDemo,
  accessibilityLineDemo
} from "../../demo-data.ts";

const pageHeadingStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  justifyContent: "center"
};

const chartHeadingStyle = {
  marginBottom: "0px",
  marginTop: "25px"
};

const containerStyle = {
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "flex-start"
};

const chartContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "50%",
  height: "50%"
};

export default class App extends React.Component {
  render() {
    return (
      <>
        <div style={pageHeadingStyle}>
          <h3>Tabbable charts with aria-labels</h3>
        </div>
        <div className="demo" style={containerStyle}>
          {/** BAR CHART */}
          <div style={chartContainerStyle}>
            <h3 style={chartHeadingStyle}> Bar </h3>
            <VictoryChart domainPadding={{ x: 40, y: 40 }}>
              <VictoryBar
                style={{ data: { fill: "#c43a31" } }}
                data={accessibilityBarData}
                dataComponent={
                  <Bar
                    ariaLabel={({ datum }) => `x: ${datum.x}`}
                    tabIndex={({ index }) => index + 1}
                  />
                }
              />
            </VictoryChart>
          </div>
          {/** BOX PLOT */}
          <div style={chartContainerStyle}>
            <h3 style={chartHeadingStyle}> Box plot </h3>
            <VictoryChart domainPadding={{ x: 40, y: 40 }}>
              <VictoryBoxPlot
                /** datum props available w/example values:
                 * x: "green"
                 * xName: "green"
                 * y: (4) [3, 5, 6, 9]
                 * _max: 9
                 * _median: 5.5
                 * _min: 3
                 * _q1: 4.5
                 * _q3: 6.75
                 * _x: 3
                 * _y: 3
                 */
                minLabels
                maxLabels
                data={accessibilityBoxData}
                maxComponent={
                  <Whisker
                    ariaLabel={({ datum }) => `${datum.x} max is ${datum._max}`}
                    tabIndex={({ index }) => index + 5}
                  />
                }
                q3Component={
                  <Border
                    ariaLabel={({ datum }) => `${datum.x} q3 value is ${datum._q3}`}
                    tabIndex={({ index }) => index + 6.1}
                  />
                }
                medianComponent={
                  <LineSegment
                    ariaLabel={({ datum }) => `${datum.x} median value is ${datum._median}`}
                    tabIndex={({ index }) => index + 5.1}
                  />
                }
                q1Component={
                  <Border
                    ariaLabel={({ datum }) => `${datum.x} q1 value is ${datum._q1}`}
                    tabIndex={({ index }) => index + 6.2}
                  />
                }
                minComponent={
                  <Whisker
                    ariaLabel={({ datum }) => `${datum.x} min is ${datum._min}`}
                    tabIndex={({ index }) => index + 5.2}
                  />
                }
              />
            </VictoryChart>
          </div>

          {/** AREA */}
          <div style={chartContainerStyle}>
            <h3 style={chartHeadingStyle}> Area </h3>
            <VictoryChart domainPadding={{ y: 10 }}>
              <VictoryStack>
                <VictoryArea
                  data={accessibilityAreaData.a}
                  dataComponent={
                    <Area
                      ariaLabel={({ data }) => `area chart stack ${data[0]._stack}`}
                      tabIndex={20}
                    />
                  }
                />
                <VictoryArea
                  data={accessibilityAreaData.b}
                  dataComponent={
                    <Area
                      ariaLabel={({ data }) => `area chart stack ${data[0]._stack}`}
                      tabIndex={20.1}
                    />
                  }
                />
                <VictoryArea
                  data={accessibilityAreaData.c}
                  dataComponent={
                    <Area
                      ariaLabel={({ data }) => `area chart stack ${data[0]._stack}`}
                      tabIndex={20.2}
                    />
                  }
                />
                <VictoryArea
                  data={accessibilityAreaData.d}
                  dataComponent={
                    <Area
                      ariaLabel={({ data }) => `area chart stack ${data[0]._stack}`}
                      tabIndex={20.3}
                    />
                  }
                />
              </VictoryStack>
            </VictoryChart>
          </div>

          {/** LINE */}
          <div style={chartContainerStyle}>
            <h3 style={chartHeadingStyle}> Line </h3>
            <VictoryChart domain={{ x: [0, 6], y: [0, 7] }}>
              <VictoryLine
                data={accessibilityLineDemo}
                dataComponent={
                  <Curve
                    ariaLabel={({ data }) =>
                      data.map(
                        (data, i) =>
                          `data point ${i + 1} x value is ${data.x} and y value is ${data.y}`
                      )
                    }
                    tabIndex={21}
                  />
                }
              />
            </VictoryChart>
          </div>

          {/** PIE */}
          <div style={chartContainerStyle}>
            <h3 style={chartHeadingStyle}> Pie </h3>
            <VictoryPie
              style={{ labels: { fill: "white", fontSize: 10 } }}
              labelRadius={({ datum }) => datum.radius - 12}
              width={400}
              height={250}
              radius={({ datum }) => datum.radius}
              data={accessibilityPieDemo}
              dataComponent={
                <Slice
                  ariaLabel={({ datum }) => `pie slice ${datum.x}`}
                  tabIndex={({ index }) => index + 22}
                />
              }
            />
          </div>

          {/** Scatter */}
          {/* <div style={chartContainerStyle}>
            <h3>Scatter</h3>
            <VictoryChart domain={{ x: [0, 6], y: [0, 8] }}>
              <VictoryScatter
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                data={accessibilityScatterDemo}
              />
            </VictoryChart>
          </div> */}

          {/** VORONOI */}
          {/* <div style={chartContainerStyle}>
            <h3>Voronoi</h3>
            <VictoryChart></VictoryChart>
          </div> */}

          {/** HISTOGRAM */}
          {/* <div style={chartContainerStyle}>
            <h3>Histogram</h3>
            <VictoryChart></VictoryChart>
          </div> */}
        </div>
      </>
    );
  }
}
