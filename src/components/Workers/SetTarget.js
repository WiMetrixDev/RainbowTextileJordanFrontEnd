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

function MyTable({ columns, data, handleUpload }) {
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
            initialState: { pageSize: 50 },
        },
        useGlobalFilter,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...getToggleAllRowsSelectedProps()}
                            />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...row.getToggleRowSelectedProps()}
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );
    // // console.log('porps', props)
    // console.log('____________________________________________________________________________',previousPage,
    // canPreviousPage,
    // nextPage,
    // canNextPage,
    // pageIndex,
    // pageOptions,
    // gotoPage,
    // pageSize,
    // setPageSize)

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                }}
            >
                <div style={{ width: 300 }}>
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>
            <table {...getTableProps()} style={{ width: "100%" }}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
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
                            <tr {...row.getRowProps()}>
                                {/* <td>{i+1}</td> */}
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
                                {/* <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                    setModalVisible(true)
                    setModalValues(row.original)
                }} style={{ cursor: 'pointer', marginRight: 15 }} /><DeleteIcon color='primary' onClick={() => {
                    handleDelete(row.original); setOpenBackdrop(true);
                }} style={{ cursor: 'pointer' }} /></td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <p>Selected Workers: {Object.keys(selectedRowIds).length}</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    Previous Page
                </button>
                <div>
                    Page{" "}
                    <em>
                        {pageIndex + 1} of {pageOptions.length}
                    </em>
                </div>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Next Page
                </button>
            </div>
            {Object.keys(selectedRowIds).length > 0 ? (
                <Grid
                    container
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ marginTop: 20 }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpload(selectedRowIds)}
                            style={{ color: "#fff", height: 55 }}
                        >
                            Set Target
                        </Button>
                    </Grid>
                </Grid>
            ) : null}
        </div>
    );
}

class ComponentToPrint extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <table>
                <thead>
                    <th>column 1</th>
                    <th>column 2</th>
                    <th>column 3</th>
                </thead>
                <tbody>
                    <tr>
                        <td>data 1</td>
                        <td>data 2</td>
                        <td>data 3</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

const SetTarget = React.forwardRef((props, ref) => {
    // const [designations,setDesignations] = React.useState([])
    const [deparments, setDepartments] = React.useState([]);
    const [lines, setLines] = React.useState([]);
    const [workers, setWorkers] = React.useState([]);
    const [state, setState] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [time, onChange] = React.useState(null);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
                    "/Jordan/SPTS/worker/getWorkersForDepartment.php?department_id=" +
                    state.department.department_id,
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
    const fetchWorkersForStiching = () => {
        setWorkers([]);
        try {
            fetch(
                api_endpoint +
                    "/Jordan/SPTS/worker/getWorkersForStitching.php?department_id=" +
                    state.department.department_id +
                    "&&line_id=" +
                    state.line["line id"],
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
                <Grid item lg={4} md={4} sm={6} xs={6} style={{ padding: 5 }}>
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
                    </>
                ) : null}
                {workers.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: 10,
                        }}
                    >
                        <Typography variant="subtitle1">Target Time</Typography>
                        <TimePicker
                            showSecond={false}
                            // defaultValue={moment().hour(0).minute(0)}
                            onChange={(value) => onChange(value)}
                            format={"h:mm a"}
                            use12Hours
                            inputReadOnly
                        />
                    </div>
                ) : null}
            </Grid>

            {workers.length > 0 ? (
                <div>
                    {/* <ComponentToPrint  ref={componentRef} props={workers} /> */}
                    {/* <button onClick={handlePrint}>Print this out!</button> */}
                    <MyTable
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
                    />
                </div>
            ) : null}
        </div>
    );
});

export default withSnackbar(SetTarget);
