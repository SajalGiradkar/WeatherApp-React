import React from 'react'
import axios from 'axios';
import './Weather.css'
import date from 'date-and-time';
// navbar 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Weather extends React.Component<any, any> {
    baseUrl: any = 'http://api.weatherapi.com/v1/forecast.json';
    apiKey: any = '3b0ae2dd16e14453933123528231201';
    date = new Date();
    constructor(props: any) {
        super(props)
        this.state = {
            city: localStorage.getItem('cityName'),
            location: {},
            currentData: {},
            condition: {},
            forecastDays: [],
            updatedTime: [],
            forecastCurrentDay: {},
            showDetail: false,
        }

    }
    showData = (maxTemp: any, date: any, minTemp: any, condition: any, img: any, avgTemp: any, avgHumidity: any, maxWind: any) => {
        // console.log(this.state.forecastCurrentDay.maxTemp, this.state.forecastCurrentDay.date);
        this.setState({
            forecastCurrentDay: {
                maxTemp: maxTemp,
                date: date,
                minTemp: minTemp,
                condition: condition,
                image: img,
                average: avgTemp,
                avgHumidity: avgHumidity,
                maxWind: maxWind
            }
        })
        this.setState({
            showDetail: true
        })
        window.scrollTo(0, 500)
    }
    fetchWeatherData = async () => {
        // let response: any = await fetch(`${this.baseUrl}?key=${this.apiKey}&q=${this.state.city}`)
        let { data } = await axios.get(`${this.baseUrl}?key=${this.apiKey}&q=${this.state.city}&days=10`)
        // console.log(data)

        this.setState({
            location: data.location,
            currentData: data.current,
            condition: data.current.condition,
            forecastDays: data.forecast.forecastday,
            updatedTime: data.location.localtime.split(' '),
        })
        localStorage.setItem("cityName", this.state.city);
    }
    cityName = (event: any) => {
        this.setState({
            city: event.target.value
        })
    }

    componentDidMount(): void {
        this.fetchWeatherData();
    }


    render() {
        return (
            <>
                <Navbar bg="light" expand="lg" fixed="top" className='p-3 ml-5 bg-dark '>
                    <Container fluid>
                        <Navbar.Brand className='fs-2 fw-semibold text-light d-flex w-100 justify-content-between'>SG. Weather Report</Navbar.Brand>
                        <Form className="d-flex ">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2 fs-3 mt-2"
                                aria-label="Search"
                                onChange={this.cityName}
                                value={this.state.city}
                            />
                            <Button variant="outline-info"
                                className="me-2 fs-3 mt-2"
                                onClick={this.fetchWeatherData}
                            >
                                Search
                            </Button>
                        </Form>

                    </Container>
                </Navbar>
                {/* current data  */}

                <div className='weather-container'>
                    <div className="current-data">
                        <h1>{this.state.location.name}, {this.state.location.country}</h1>
                        <h2 className='todays-date' >{date.format(this.date, 'ddd, MMM DD YYYY')}</h2>
                        <div className="temp">
                            <div>
                                <img src={this.state.condition.icon} />
                                <strong>{this.state.currentData.temp_c}<sup>o<sup>c</sup></sup></strong>
                            </div>
                            <h2 className='condition'> {this.state.condition.text}</h2>
                            <h4>Updated as of {this.state.updatedTime[1]}</h4>
                        </div>
                        <div className="current-info">

                            <span>Feels like {this.state.currentData.feelslike_c}<sup>o</sup></span>
                            <span>Wind <i className="fas fa-location-arrow" style={{ rotate: 45 - this.state.currentData.wind_degree + 'deg' }}></i>  {this.state.currentData.wind_kph} km/h</span>
                            <span>Visibility {this.state.currentData.vis_km} km/h</span>
                            <br />
                            <span>Precipitation {this.state.currentData.precip_in}%</span>
                            <span>Humidity {this.state.currentData.humidity}%</span>
                            <span>UV {this.state.currentData.uv}</span>

                        </div>
                    </div>

                    {/*10 days forecast data  */}
                    <div className="forecast">
                        <h1>Daily</h1>
                        {/* in table format  */}
                        { /*<table border={1} cellPadding='5' cellSpacing={0} align='center'>
                            <thead>
                                <th>day</th>
                                <th>icon</th>
                                <th>condition</th>
                                <th>max temp</th>
                                <th>min temp</th>
                            </thead>
                            <tbody>

                                {this.state.forecastDays.map((day: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td>{day.date}</td>
                                            <td><img src={day.day.condition.icon} alt="icon" /></td>
                                            <td>{day.day.condition.text}</td>
                                            <td>{day.day.maxtemp_c}</td>
                                            <td>{day.day.mintemp_c}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                            </table>*/}
                        <div className="forecast-box">
                            {
                                this.state.forecastDays.map((day: any, index: any) => {
                                    return (
                                        <div className="forecast-day "
                                            key={index}
                                            onClick={() => this.showData(day.day.maxtemp_c, day.date, day.day.mintemp_c, day.day.condition.text, day.day.condition.icon, day.day.avgtemp_c, day.day.avghumidity, day.day.maxwind_kph)}
                                        >
                                            <h3>{(day.date.split('-').reverse().join('-'))}</h3>
                                            <img src={day.day.condition.icon} /> <br />
                                            <strong title='max'>{day.day.maxtemp_c}<sup>o</sup>  </strong> <small title='min'>{day.day.mintemp_c}<sup>o</sup></small>
                                            <p>{day.day.condition.text}</p>
                                        </div>
                                    )
                                })

                            }

                        </div>

                    </div>
                    {this.state.showDetail ?
                        <div className=' container table-responsive-md '>
                            <table border={0} cellPadding='5' cellSpacing={0} align='center' className='detail-table table table-dark table-hover'>
                                <thead className='bg-dark'>
                                    <th scope="col-lg-6" >day</th>
                                    <th scope="col" >condition</th>
                                    <th scope="col" >max. temp</th>
                                    <th scope="col" >min. temp</th>
                                    <th scope="col" >average temp.</th>
                                    <th scope="col" >avg. Humidity</th>
                                    <th scope="col" >avg. Wind speed</th>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td>{this.state.forecastCurrentDay.date.split('-').reverse().join('-')}</td>
                                        <td><img src={this.state.forecastCurrentDay.image} alt="icon" />{this.state.forecastCurrentDay.condition}</td>
                                        <td>{this.state.forecastCurrentDay.maxTemp}</td>
                                        <td>{this.state.forecastCurrentDay.minTemp}</td>
                                        <td>{this.state.forecastCurrentDay.average}</td>
                                        <td>{this.state.forecastCurrentDay.avgHumidity}</td>
                                        <td>{this.state.forecastCurrentDay.maxWind} Km/h</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> : ''
                    }
                </div>

            </>
        )
    }
}