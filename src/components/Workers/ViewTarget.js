import React, { useRef } from "react";
import {
    Grid,
    TextField,
    Button,
    InputAdornment,
    Typography,
} from "@material-ui/core";
import { api_endpoint } from "../../util/config";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    useTable,
    usePagination,
    useGlobalFilter,
    useRowSelect,
} from "react-table";
import { withSnackbar } from "notistack";
import SearchIcon from "@material-ui/icons/Search";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import ReactToPrint from "react-to-print";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    //const count = preGlobalFilteredRows.length

    return (
        <span>
            <TextField
                name="searchValue"
                variant="outlined"
                label="Search Workers"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon
                                color="primary"
                                style={{ cursor: "pointer" }}
                            />
                        </InputAdornment>
                    ),
                }}
            />
        </span>
    );
}

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        );
    }
);

function MyTable({ columns, data, handleUpload, department, date, line }) {
    // Use the useTable hook to create your table configuration
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        previousPage,
        state: { pageIndex, pageSize, globalFilter },
        canPreviousPage,
        nextPage,
        page,
        canNextPage,
        // pageIndex,
        pageOptions,
        selectedFlatRows,
        state: { selectedRowIds },
        setGlobalFilter,
        preGlobalFilteredRows,
        // pageSize,
        setPageSize,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 1000000 },
        },
        useGlobalFilter,
        usePagination,
        useRowSelect
    );

    function caclulateTotalOvertime() {
        let totalOvertime;
        var hour = 0;
        var minute = 0;
        var second = 0;

        data.map((dt) => {
            if (dt.target) {
                let time = dt.target;
                // if (splitTime1) {
                var splitTime1 = time.split(":");
                hour = parseInt(splitTime1[0]) + parseInt(hour);
                minute = parseInt(splitTime1[1]) + parseInt(minute);
                hour = hour + minute / 60;
                minute = minute % 60;
                second = parseInt(splitTime1[2]) + parseInt(second);
                minute = minute + second / 60;
                second = second % 60;
            }

            // }
        });
        return parseInt(hour) + ":" + parseInt(minute) + ":" + parseInt(second);
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginTop: 20,
                    }}
                >
                    <Typography>RAINBOW LLC JORDAN</Typography>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                <Typography>
                    DEPARTMENT: {department.department_code}
                </Typography>
                <Typography>LINE: {line["line code"]}</Typography>
                <Typography>Date: {date}</Typography>
                <Typography>OVER TIME SHEET</Typography>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <Typography>_____________</Typography>
                    <Typography>SUPERVISOR</Typography>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <Typography>_______________</Typography>
                    <Typography>P.M SIGNATURE</Typography>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <Typography>___________</Typography>
                    <Typography>INCHARGE</Typography>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <Typography>________________</Typography>
                    <Typography>ADMINISTRATOR</Typography>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: 20,
                    }}
                >
                    <Typography>_________________</Typography>
                    <Typography>GENERAL MANAGER</Typography>
                </div>
            </div>
            <table
                {...getTableProps()}
                style={{ width: "100%", marginTop: 80 }}
            >
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th>Serial</th>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        // console.log('row: ',row)
                        return (
                            <tr>
                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            style={{ textAlign: "center" }}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}

                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            TOTAL OVERTIME
                        </td>
                        <td style={{ textAlign: "center" }}>
                            {caclulateTotalOvertime()}
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                }}
            >
                <Typography>SUPERVISOR</Typography>
                <Typography>INCHARGE</Typography>
                <Typography>P.M SIGNATURE</Typography>
                <Typography>ADMINISTRATOR</Typography>
            </div> */}
        </div>
    );
}

class ComponentToPrint extends React.Component {
    constructor(props) {
        super(props);
        this.state = { props: props };
        console.log(props);
    }
    render() {
        return (
            <div>
                {/* <Grid container lg={12} md={12} sm={12} xs={12}>
                    <table>
                        <thead>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <tr>
                                    {this.state.props.columns.map((column) => (
                                        <th>{column.Header}</th>
                                    ))}
                                </tr>
                            </Grid>
                        </thead>
                        <tbody>
                            {this.state.props.data.map((worker) => (
                                <Grid container lg={8} md={8} sm={8} xs={8}>
                                    <tr>
                                        {this.state.props.columns.map(
                                            (column) => (
                                                <td>
                                                    {worker[column.accessor]}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                </Grid>
                            ))}
                        </tbody>
                    </table>
                </Grid> */}

                <MyTable
                    columns={this.state.props.columns}
                    data={this.state.props.data}
                    handleUpload={this.state.props.handleUpload}
                    date={this.state.props.date}
                    department={this.state.props.department}
                    line={this.state.props.line}
                />
            </div>
        );
    }
}

const SetTarget = React.forwardRef((props, ref) => {
    // const [designations,setDesignations] = React.useState([])
    var d = new Date();
    const [lines, setLines] = React.useState([]);
    const [deparments, setDepartments] = React.useState([]);
    const [workers, setWorkers] = React.useState([]);
    const [state, setState] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [time, onChange] = React.useState(null);
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
    console.log(JSON.stringify(date));
    const componentRef = useRef();

    const handleUpload = (vals) => {
        if (!time) {
            props.enqueueSnackbar("Select target time first!", {
                variant: "warning",
            });
            return;
        }

        setLoading(true);
        let datetime = moment(time, "HH:mm").format("YYYY-MM-DD HH:mm");
        let keysArray = Object.keys(vals);
        let arr = [];
        for (let i = 0; i < keysArray.length; i++) {
            console.log(workers[parseInt(keysArray[i])].worker_id);
            arr.push(workers[parseInt(keysArray[i])].worker_id);
        }
        console.log(arr);
        console.log(
            "rows: ",
            arr,
            ", time: ",
            datetime,
            ", department: ",
            state.department.department_code
        );
        try {
            let url =
                api_endpoint +
                `/Jordan/AttendanceSystem/updateTargetForWorkers.php`;
            console.log("url: ", url);
            // alert(url)
            fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    workers: arr,
                    target: datetime,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setLoading(false);
                    console.log("res: ", res);
                    if (res.Error_No === 0) {
                        props.enqueueSnackbar(
                            "Successfully updated Target Time!",
                            {
                                variant: "info",
                            }
                        );
                    } else {
                        if (typeof res.Error_Description === "object") {
                            console.log("objecttypeee");
                            props.enqueueSnackbar(
                                "Error while saving target time!",
                                {
                                    variant: "info",
                                }
                            );
                        } else {
                            props.enqueueSnackbar(res.Error_Description, {
                                variant: "info",
                            });
                        }
                    }
                    //console.log('generate qrcode response',res)
                    //setQrCode(res.code)
                })
                .catch((err) => {
                    console.log("error while fetching", err);
                    props.enqueueSnackbar("Error while saving target time!", {
                        variant: "info",
                    });
                    setLoading(false);
                });
        } catch (err) {
            console.log("err in try catch", err);
            props.enqueueSnackbar("Error while saving target time!", {
                variant: "info",
            });
            setLoading(false);
        }
    };

    const fetchWorkers = () => {
        setWorkers([]);
        try {
            fetch(
                api_endpoint +
                    "/Jordan/SPTS/worker/getTargetsWorkersForDepartment.php?department_id=" +
                    state.department.department_id +
                    "&&attendance_date=" +
                    date,
                {
                    method: "post",
                }
            )
                .then((res) =>
                    res.json().then((res) => {
                        console.log("res departments", res);
                        if (res.Workers) {
                            setWorkers(res.Workers);
                        } else {
                            props.enqueueSnackbar("No worker found!", {
                                variant: "info",
                            });
                        }
                    })
                )
                .catch((err) => {
                    console.log("err in fetch", err);
                });
        } catch (err) {
            console.log("err in fetch", err);
        }
    };

    const fetchWorkersForStiching = () => {
        setWorkers([]);
        try {
            fetch(
                api_endpoint +
                    "/Jordan/SPTS/worker/getTargetsWorkersForStitching.php?department_id=" +
                    state.department.department_id +
                    "&&line_id=" +
                    state.line["line id"] +
                    "&&attendance_date=" +
                    date,
                {
                    method: "post",
                }
            )
                .then((res) =>
                    res.json().then((res) => {
                        console.log("res departments", res);
                        if (res.Workers) {
                            setWorkers(res.Workers);
                        } else {
                            setWorkers([]);
                            props.enqueueSnackbar("No worker found!", {
                                variant: "info",
                            });
                            console.log(workers);
                        }
                    })
                )
                .catch((err) => {
                    console.log("err in fetch", err);
                });
        } catch (err) {
            console.log("err in fetch", err);
        }
    };
    React.useEffect(() => {
        if (state.department) {
            if (state.department.department_id === 11) {
                console.log("stiching");
                setState({ ...state, lineFilter: true });
            } else {
                setState({ ...state, lineFilter: false });
            }
        } else {
            setWorkers([]);
            setState({ ...state, lineFilter: false });
        }
    }, [state.department]);

    React.useEffect(() => {
        try {
            fetch(api_endpoint + "/Jordan/SPTS/worker/getDepartments.php")
                .then((res) =>
                    res.json().then((res) => {
                        console.log("res departments", res);
                        setDepartments(res.Departments);
                    })
                )
                .catch((err) => {
                    console.log("err in fetch", err);
                });
        } catch (err) {
            console.log("err in fetch", err);
        }

        try {
            fetch(api_endpoint + "/Jordan/SQMS/getAllLines.php", {
                method: "post",
            })
                .then((res) =>
                    res.json().then((res) => {
                        console.log("res Lines", res);
                        if (res.Lines) {
                            setLines(res.Lines);
                        } else {
                            props.enqueueSnackbar("No Lines found!", {
                                variant: "info",
                            });
                        }
                    })
                )
                .catch((err) => {
                    console.log("err in fetch", err);
                });
        } catch (err) {
            console.log("err in fetch", err);
        }
    }, []);

    return (
        <div>
            <Grid
                container
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Grid item lg={3} md={3} sm={6} xs={6} style={{ padding: 5 }}>
                    <Autocomplete
                        //id="combo-box-demo"
                        options={deparments}
                        getOptionLabel={(option) => option.department_code}
                        style={{ width: "100%" }}
                        onChange={(e, v) =>
                            setState({ ...state, department: v })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Department"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    {/* <TextField name="department" variant="outlined" fullWidth label="Department"/> */}
                </Grid>

                {state.lineFilter == true ? (
                    <Grid
                        item
                        lg={3}
                        md={3}
                        sm={6}
                        xs={12}
                        style={{ padding: 5 }}
                    >
                        <Autocomplete
                            //id="combo-box-demo"
                            options={lines}
                            getOptionLabel={(option) => option["line code"]}
                            style={{ width: "100%" }}
                            onChange={(e, v) => setState({ ...state, line: v })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Lines"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                ) : null}
                {state.department ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: 10,
                        }}
                    >
                        <TextField
                            id="date"
                            label="Date"
                            type="date"
                            defaultValue={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                            }}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                ) : null}
                {state.department ? (
                    <>
                        <Grid
                            item
                            lg={3}
                            md={3}
                            sm={6}
                            xs={12}
                            style={{ padding: 5 }}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ color: "#fff", height: 55 }}
                                onClick={() => {
                                    if (state.lineFilter && state.line) {
                                        fetchWorkersForStiching();
                                    } else {
                                        fetchWorkers();
                                    }
                                }}
                                fullWidth
                            >
                                fetch workers
                            </Button>
                        </Grid>
                        {workers.length > 0 ? (
                            <Grid
                                item
                                lg={3}
                                md={3}
                                sm={6}
                                xs={12}
                                style={{ padding: 5 }}
                            >
                                <ReactToPrint
                                    trigger={() => (
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            style={{
                                                color: "#fff",
                                                height: 55,
                                            }}
                                            onClick={() => {
                                                if (
                                                    state.lineFilter &&
                                                    state.line
                                                ) {
                                                    fetchWorkersForStiching();
                                                } else {
                                                    fetchWorkers();
                                                }
                                            }}
                                            fullWidth
                                        >
                                            Print
                                        </Button>
                                    )}
                                    content={() => componentRef.current}
                                />
                            </Grid>
                        ) : null}
                    </>
                ) : null}
            </Grid>

            {workers.length > 0 ? (
                <div>
                    <div></div>
                    <ComponentToPrint
                        style={{ display: "none" }}
                        ref={componentRef}
                        columns={[
                            {
                                Header: "Worker Code",
                                accessor: "worker_code",
                            },
                            {
                                Header: "Worker Name",
                                accessor: "worker_name",
                            },
                            {
                                Header: "In Time",
                                accessor: "in_time",
                            },
                            {
                                Header: "Out Time",
                                accessor: "out_time",
                            },
                            {
                                Header: "Overtime",
                                accessor: "target",
                            },

                            {
                                Header: "Worker Signature",
                                accessor: "signature",
                            },
                        ]}
                        data={workers}
                        date={date}
                        line={state.line ? state.line : ""}
                        handleUpload={handleUpload}
                        department={state.department}
                    />
                    {/* <ComponentToPrint  ref={componentRef} props={workers} /> */}
                    {/* <MyTable
                        ref={componentRef}
                        columns={[
                            {
                                Header: "Worker Code",
                                accessor: "worker_code",
                            },
                            {
                                Header: "Worker Name",
                                accessor: "worker_name",
                            },
                        ]}
                        data={workers}
                        handleUpload={handleUpload}
                    /> */}
                </div>
            ) : null}
        </div>
    );
});

export default withSnackbar(SetTarget);
