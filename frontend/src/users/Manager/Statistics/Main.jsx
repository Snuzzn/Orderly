import React, { useEffect, useContext } from "react";
import { Heading, HeadingLevel } from "baseui/heading";
import { TitleCont } from "../../../components/styles";
import ToggleButton from "../../../components/SideDrawer/DrawerToggleButton";
import styled from "styled-components";
import { DatePicker } from "baseui/datepicker";
import { addDays } from "date-fns";
import { Select, TYPE } from "baseui/select";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { fetchRequest } from "../../../helper/fetchRequest";
import { AuthContext } from "../../../context/AuthContext";
import { FormControl } from "baseui/form-control";
import { LabelSmall } from "baseui/typography";

// const statistics = {
//   item_sales: {
//     Burger: 3,
//     Fries: 9,
//     Ramen: 3,
//     Sushi: 1
//   },
//   totalRevenue: 123
// }

// const yearStatistics = {
//   Burger: [3, 4, 7, 6, 5, 4, 3, 2, 1, 7, 8, 12],
//   Ramen: [0,9,8,0,0,0,0,0,5, 7, 9, 10]
// }

const ENDPOINT = "http://localhost:3001";

const Statistics = () => {
  const [rangeDate, setRangeDate] = React.useState([new Date(), new Date()]);
  // selected items
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  // chart data
  const [chartLabels, setchartLabels] = React.useState([]);
  const [chartDatasets, setchartDatasets] = React.useState([]);
  const [itemNum, setItemNum] = React.useState([]);

  const { oId } = useContext(AuthContext);
  // console.log(oId);
  const getStatistics = async (start, end) => {
    if (
      rangeDate[0].toLocaleDateString() !== lastYearDate.toLocaleDateString()
    ) {
      // INTEGRATE: fetch data here
      const start_date = start.toISOString();
      const end_date = end.toISOString();

      const [data, error] = await fetchRequest(
        `${ENDPOINT}/statistics/items-sold/${oId}/${start_date}/${end_date}`
      );
      const statistics = data.output;
      // get lables of the chart
      const tempLabels = Object.keys(statistics.item_sales);
      setchartLabels(tempLabels);
      //console.log(chartLabels);

      // get all no of items sold
      const tempItemNum = Object.values(statistics.item_sales);
      setItemNum(tempItemNum);
      //console.log(itemNum);

      // get chartDatasets
      const tempDataset = [
        {
          label: "No. Items sold",
          data: tempItemNum,
          backgroundColor: ["#eb7347"],
        },
      ];
      setchartDatasets(tempDataset);
      //console.log(chartDatasets[0]);
    } else if (
      rangeDate[0].toLocaleDateString() === lastYearDate.toLocaleDateString()
    ) {
      // INTEGRATE: fetch data here

      // const start_date = start.toISOString();
      // const end_date = end.toISOString();

      // const [data, error] = await fetchRequest(`${ENDPOINT}/statistics/items-sold/${oId}/${start_date}/${end_date}`)

      const [data, error] = await fetchRequest(
        `${ENDPOINT}/statistics/season/${oId}`
      );
      console.log(data);
      const yearStatistics = data.output;

      // find previous 12 months as data label
      const today = new Date();
      //console.log(today.getMonth())
      let lastMonths = [];
      // let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let monthNames = [
        "Dec",
        "Nov",
        "Oct",
        "Sep",
        "Aug",
        "Jul",
        "Jun",
        "May",
        "Apr",
        "Mar",
        "Feb",
        "Jan",
      ];
      for (let i = 0; i < 12; i++) {
        // lastMonths.push(monthNames[today.getMonth()]);
        const month = 12 - today.getMonth() - 2;
        if (month === -1) {
          lastMonths.push(monthNames[11]);
        } else {
          lastMonths.push(monthNames[month]);
        }

        today.setMonth(today.getMonth() + 1);
      }
      setchartLabels(lastMonths);
      //console.log(lastMonths);
      let tempDataset = [];
      let tempItems = [];
      for (const [key, value] of Object.entries(yearStatistics)) {
        let option = { id: key };
        tempItems.push(option);
        //console.log(key, value);
        let temp = [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ];
        let count = 11;
        for (let i = value.length; i > 0; i--) {
          // if (value[i - 1] !== 0) {
          //   temp[count] = value[i - 1];
          // }
          temp[count] = value[i - 1];
          count--;
        }
        //console.log(temp);
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const tempData = {
          label: key,
          data: temp,
          backgroundColor: [`#${randomColor}`],
          // borderColor: [`#${randomColor}`]
        };
        //console.log(tempData);
        tempDataset.push(tempData);
      }
      //console.log(tempDataset);
      setchartDatasets(tempDataset);
      setItems(tempItems);
      //console.log(chartDatasets);
    }
  };

  React.useEffect(() => {
    getStatistics(rangeDate[0], rangeDate[1]);
  }, [rangeDate]);

  const BarChartData = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  const LineChartData = {
    labels: chartLabels,
    datasets: chartDatasets,
  };

  const currentDate = new Date();
  const lastYear = currentDate.setFullYear(currentDate.getFullYear() - 1);
  const lastYearDate = new Date(lastYear);
  // console.log(value);
  return (
    <Wrapper>
      <HeadingLevel>
        <TitleCont>
          <Heading styleLevel={4}>Statistics</Heading>
          <ToggleButton />
        </TitleCont>
      </HeadingLevel>
      <SelectCont>
        <FormControl label={() => "Date Range"}>
          <DatePicker
            range
            value={rangeDate}
            onChange={({ date }) => setRangeDate(date)}
            placeholder="YYYY/MM/DD – YYYY/MM/DD"
            quickSelect
            quickSelectOptions={[
              {
                id: "Past year",
                beginDate: lastYearDate,
                endDate: new Date(),
              },
            ]}
            overrides={{
              QuickSelectFormControl: {
                props: {
                  overrides: {
                    Label: () => (
                      <LabelSmall>{"Qty sold over time"}</LabelSmall>
                    ),
                  },
                },
              },
            }}
          />
        </FormControl>

        {/* {(rangeDate[0].toLocaleDateString() === lastYearDate.toLocaleDateString()) && 
        <Select
          options={items}
          labelKey="id"
          placeholder="Choose items"
          maxDropdownHeight="300px"
          type={TYPE.search}
          onChange={params => setValue(params.value)}
          value={value}
        />} */}
      </SelectCont>
      {rangeDate[0].toLocaleDateString() ===
      lastYearDate.toLocaleDateString() ? (
        <LineChart chartData={LineChartData} />
      ) : (
        <BarChart chartData={BarChartData} />
      )}
    </Wrapper>
  );
};

export default Statistics;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectCont = styled.div`
  display: flex;
  flex-direction: column;
`;
