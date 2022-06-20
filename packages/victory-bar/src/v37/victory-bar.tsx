/* eslint-disable react/no-multi-comp */
import * as React from "react";
import {
  Datum,
  NumberOrCallback,
  useData,
  useDomain,
  useScale,
  useVictoryProps,
  VictoryComponentProps,
  withContainer
} from "victory-core";
import Bar from "../bar";
import { getBarPosition } from "../helper-methods";

export type VictoryBarAlignmentType = "start" | "middle" | "end";
export interface VictoryBarProps extends VictoryComponentProps {
  alignment?: VictoryBarAlignmentType;
  barRatio?: number;
  barWidth?: NumberOrCallback;
  cornerRadius?:
    | NumberOrCallback
    | {
        top?: NumberOrCallback;
        topLeft?: NumberOrCallback;
        topRight?: NumberOrCallback;
        bottom?: NumberOrCallback;
        bottomLeft?: NumberOrCallback;
        bottomRight?: NumberOrCallback;
      };
  data?: Datum[];
  dataComponent?: React.ReactElement;
  groupComponent?: React.ReactElement;
  horizontal?: boolean;
}

const defaultProps: VictoryBarProps = {
  data: [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 }
  ],
  dataComponent: <Bar />,
  groupComponent: <g role="presentation" />,
  includeZero: true,
  horizontal: false,
  sortOrder: "ascending" as const
};

// TODO: This would be a shared helper that allows us to access context values in the base component
function VictoryBar(props: VictoryBarProps) {
  const {
    alignment,
    barRatio,
    barWidth,
    dataComponent,
    cornerRadius,
    horizontal,
    groupComponent,
    data
  } = useVictoryProps<VictoryBarProps, "dataComponent" | "groupComponent">(
    "bar",
    props,
    defaultProps
  );
  const scale = useScale();
  const formattedData = useData();
  const domain = useDomain();

  const children = formattedData.map((datum: Datum, i: number) => {
    const { x, y, x0, y0 } = getBarPosition(
      { domain, scale, horizontal },
      datum
    );
    const dataProps = {
      index: i,
      key: `bar-${i}`,
      alignment,
      barRatio,
      barWidth,
      cornerRadius,
      scale,
      data,
      x,
      y,
      x0,
      y0,
      datum
    };
    return React.cloneElement(dataComponent, dataProps);
  });
  return React.cloneElement(groupComponent, {}, children);
}

export default withContainer<VictoryBarProps>(VictoryBar);
