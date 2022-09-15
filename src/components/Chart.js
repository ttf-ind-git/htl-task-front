import React from "react";
import { Row, Col } from "react-bootstrap";
import Filter from "./Filter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const state_bar = {
  labels: [],
  datasets: [
    {
      label: "Bar Chart",
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(59, 162, 235, 0.2)",
      ],
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [],
    },
  ],
};

const state_pie = {
  labels: [],
  datasets: [
    {
      label: "Pie Chart",
      backgroundColor: [
        "#B21F00",
        "#C9DE00",
        "#2FDE00",
        "#00A6B4",
        "#6800B4",
        "#880867",
      ],
      hoverBackgroundColor: [
        "#501800",
        "#4B5000",
        "#175000",
        "#003350",
        "#35014F",
      ],
      data: [],
    },
  ],
};

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: {},
      data: [],
      labels: [],
      chart_type: 'Bar',
    };
  }

  componentDidMount() {
    const getCars = async () => {
      const response = await fetch(
        "https://62a2e6845bd3609cee5ce6e4.mockapi.io/cars"
      );

      const data = await response.json();
      // console.log("data:",data)
      this.setState({ cars: data });

      // Group by date
      const group = this.group_by_name(data);

      this.setState({ labels: Object.keys(group) });
      this.setState({ data: Object.values(group) });
    };

    getCars();
  }

  group_by_name = (filteredCars) => {
    var group_by_car = filteredCars.reduce((p, c) => {
      var name = c.name;
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;
      return p;
    }, {});

    return group_by_car;
  };

  FilterHandle = (start_date, end_date) => {
    if (!start_date || !end_date) {
      alert("Please select dates..");
      return false;
    }

    if (new Date(start_date) > new Date(end_date)) {
      alert("End date must be greater than start date..");
      return false;
    }

    const filteredCars = this.state.cars.filter((item) => {
      return (
        new Date(item.createdAt) >= new Date(start_date) &&
        new Date(item.createdAt) <= new Date(end_date)
      );
    });

    // console.log(filteredCars.length);

    if (filteredCars.length <= 0) {
      alert("No data found..");
      return false;
    }

    const group = this.group_by_name(filteredCars);

    this.setState({ labels: Object.keys(group) });
    this.setState({ data: Object.values(group) });
  };

  buttonFilter = (value) => {
    // e.preventDefault();
    // console.log(value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const week_date = new Date();
    week_date.setDate(week_date.getDate() - 7);
    week_date.setHours(0, 0, 0, 0);
    // console.log(week_date)

    const month_date = new Date();
    month_date.setDate(month_date.getDate() - 30);
    month_date.setHours(0, 0, 0, 0);
    // console.log(month_date)

    const six_month = new Date();
    six_month.setMonth(six_month.getMonth() - 6);
    six_month.setHours(0, 0, 0, 0);
    // console.log(six_month)

    const one_year = new Date();
    one_year.setMonth(one_year.getMonth() - 12);
    one_year.setHours(0, 0, 0, 0);
    // console.log(one_year)

    const filteredCars = this.state.cars.filter((item) => {
      const date = new Date(item.createdAt);
      date.setHours(0, 0, 0, 0);

      if (value === "1D") {
        return date.toDateString() === today.toDateString();
      }

      if (value === "1W") {
        return date >= week_date;
      }

      if (value === "1M") {
        return date >= month_date;
      }

      if (value === "1Y") {
        return date >= one_year;
      }

      if (value === "6M") {
        return date >= six_month;
      }
    });

    console.log(filteredCars);

    const group = this.group_by_name(filteredCars);

    this.setState({ labels: Object.keys(group) });
    this.setState({ data: Object.values(group) });
  };

  ChangeChart = (event) => {
    console.log(event.target.value)
  }

  render() {
    state_pie.labels = this.state.labels;

    state_pie.datasets[0].data[0] = [];
    state_pie.datasets[0].data[1] = [];
    state_pie.datasets[0].data[2] = [];
    state_pie.datasets[0].data[3] = [];
    state_pie.datasets[0].data[4] = [];

    this.state.data.map((item, index) => {
      state_pie.datasets[0].data[index] = item;
    });

    state_bar.labels = this.state.labels;

    this.state.data.map((item, index) => {
      state_bar.datasets[0].data[index] = item;
    });

    
    // state_pie.labels = this.state.labels
    // state_pie.datasets[0].data = this.state.data

    //  console.log(this.state.cars)
    // console.log(this.state.labels)

    // console.log('first')
    // console.log(state_pie);

    return (
      <div className="mt-50">
        <Row>
          <Filter FilterDate={this.FilterHandle} />
        </Row>

        <Row className="chart-row">
          <Col xs={4} className="pie-chart">
            <Pie
              data={state_pie}
              options={{
                title: {
                  display: true,
                  text: "",
                  fontSize: 30,
                },
                plugins: {
                  datalabels: {
                    display: true,
                    color: "white",
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
          </Col>

          <Col xs={8} className="bar-chart">
            <div className="row">
              <Col xs={8}>
                <div jsname="kz6eYb" className="QcYZxe IwGbkd Bdfwze">
                  <div className="NDTw3e LMp9Eb" role="group">
                    <div className="dQlDUb">
                      <div
                        className="QiGJYb fw-ch-sel luQogd"
                        data-extended="true"
                        data-interval="300"
                        data-period="1d"
                        role="button"
                        tabIndex="0"
                        jsaction="trigger.BLb79e"
                        data-ved="2ahUKEwjZkrbYyKz4AhW1IbcAHVMjBx0QlOsBKAB6BAgZEAw"
                        onClick={() => this.buttonFilter("1D")}
                      >
                        <div className="qUjgX IbhwJb">
                          <div aria-label="1 day">
                            <div>1D</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dQlDUb">
                      <div
                        className="QiGJYb luQogd"
                        data-extended="false"
                        data-interval="1800"
                        data-period="5d"
                        role="button"
                        tabIndex="0"
                        jsaction="trigger.BLb79e"
                        data-ved="2ahUKEwjZkrbYyKz4AhW1IbcAHVMjBx0QlOsBKAF6BAgZEA0"
                        onClick={() => this.buttonFilter("1W")}
                      >
                        <div className="qUjgX IbhwJb">
                          <div aria-label="5 days">
                            <div>1W</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dQlDUb">
                      <div
                        className="QiGJYb luQogd"
                        data-extended="false"
                        data-interval="86400"
                        data-period="1M"
                        role="button"
                        tabIndex="0"
                        jsaction="trigger.BLb79e"
                        data-ved="2ahUKEwjZkrbYyKz4AhW1IbcAHVMjBx0QlOsBKAJ6BAgZEA4"
                        onClick={() => this.buttonFilter("1M")}
                      >
                        <div className="qUjgX IbhwJb">
                          <div aria-label="1 month">
                            <div>1M</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dQlDUb">
                      <div
                        className="QiGJYb luQogd"
                        data-extended="false"
                        data-interval="86400"
                        data-period="6M"
                        role="button"
                        tabIndex="0"
                        jsaction="trigger.BLb79e"
                        data-ved="2ahUKEwjZkrbYyKz4AhW1IbcAHVMjBx0QlOsBKAN6BAgZEA8"
                        onClick={() => this.buttonFilter("6M")}
                      >
                        <div className="qUjgX IbhwJb">
                          <div aria-label="6 months">
                            <div>6M</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dQlDUb">
                      <div
                        className="QiGJYb luQogd"
                        data-extended="false"
                        data-interval="86400"
                        data-period="1Y"
                        role="button"
                        tabIndex="0"
                        jsaction="trigger.BLb79e"
                        data-ved="2ahUKEwjZkrbYyKz4AhW1IbcAHVMjBx0QlOsBKAV6BAgZEBE"
                        onClick={() => this.buttonFilter("1Y")}
                      >
                        <div className="qUjgX IbhwJb">
                          <div aria-label="1 year">
                            <div>1Y</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <select className="form-control" onChange={ e => this.setState({ chart_type : e.target.value }) }>
                  <option value="Bar">Bar Chart</option>
                  <option value="Line">Line Chart</option>
                </select>
              </Col>
            </div>
            {this.state.chart_type === "Bar" &&
              <Bar
                data={state_bar}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  title: {
                    display: true,
                    text: "",
                    fontSize: 30,
                  },
                }}
            />
            }
            {this.state.chart_type === "Line" &&
              <Line
                data={state_bar}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  title: {
                    display: true,
                    text: "",
                    fontSize: 30,
                  },
                }}
            />
            }
          </Col>
        </Row>
      </div>
    );
  }
}
