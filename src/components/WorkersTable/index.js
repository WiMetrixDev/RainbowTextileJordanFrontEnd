import React from "react";
import {
    TextField,
    Grid,
    InputAdornment,
    Button,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Dialog } from "@material-ui/core";
import "./index.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { api_endpoint } from "../../util/config";
import { withSnackbar } from "notistack";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
                label="Search Worker"
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

function MyTable({ columns, data, setModalValues, setModalVisible }) {
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
        gotoPage,
        setGlobalFilter,
        preGlobalFilteredRows,
        // pageSize,
        setPageSize,
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        usePagination
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
        <div style={{ width: "90%" }}>
            <div>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
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
                            <th></th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {/* <td>{i+1}</td> */}
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                                <td style={{ textAlign: "center" }}>
                                    <EditIcon
                                        color="primary"
                                        onClick={() => {
                                            setModalVisible(true);
                                            setModalValues(row.original);
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            marginRight: 15,
                                        }}
                                    />
                                </td>
                                {/* <td style={{textAlign:'center'}}>
                    <InfoIcon color="primary" style={{cursor:'pointer'}} onClick={()=>{
                    setModalVisible(true)
                    console.log('row',row)
                    setModalValues(row.original)
                }}/></td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {/* <table {...getTableProps()} style={{width:'100%'}}>
                
                <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
                <tbody  {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                        </tr>
                    )
                    })}

                </tbody>
            </table> */}
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
                {/* <div>Go to page:</div>
                <input
                    type="number"
                    defaultValue={pageIndex + 1 || 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                /> */}
                {/* <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {pageSizeOptions.map(pageSize => (
             <option key={pageSize} value={pageSize}>
               Show {pageSize}
             </option>
           ))}
                </select> */}
            </div>
        </div>
    );
}

const WorkersTable = (props) => {
    const [searchText, setSearchText] = React.useState("");
    const [designations, setDesignations] = React.useState([]);
    const [deparments, setDepartments] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalValues, setModalValues] = React.useState(null);
    const [tableValues, setTableValues] = React.useState(null);
    const [editState, setEditState] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        console.log("modalValues", modalValues);
        setEditState(modalValues);
    }, [modalValues]);

    const handleUpdate = () => {
        console.log("editState", editState);

        try {
            let url =
                api_endpoint +
                `/Jordan/SPTS/worker/updateWorker.php?worker_id=${editState.worker_id}&worker_code=${editState.worker_code}&worker_name=${editState.worker_name}&department_id=${editState.department_id}&department_code=${editState.department_code}&designator_id=${editState.designator_id}&designator_code=${editState.designator_code}&fixed_salary_flag=${editState.fixed_salary_flag}`;
            console.log("url", url);
            fetch(url, {
                method: "post",
            })
                .then((res) => res.json())
                .then((res) => {
                    setLoading(false);
                    console.log("res: ", res);
                    if (res.Error_No === 0) {
                        props.enqueueSnackbar("Successfully Updated Worker!", {
                            variant: "info",
                        });
                        fetchWorkers();
                        setModalVisible(false);
                    } else {
                        if (typeof res.Error_Description === "object") {
                            console.log("objecttypeee");
                            props.enqueueSnackbar("Validation Errors!", {
                                variant: "info",
                            });
                        } else {
                            props.enqueueSnackbar(res.Error_Description, {
                                variant: "info",
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.log("error while fetching", err);
                    setLoading(false);
                    props.enqueueSnackbar("Error While Updating Worker!", {
                        variant: "info",
                    });
                });
        } catch (err) {
            console.log("err in try catch", err);
            setLoading(false);
            props.enqueueSnackbar("Error While Updating Worker!", {
                variant: "info",
            });
        }
    };

    const fetchWorkers = () => {
        try {
            fetch(api_endpoint + "/Jordan/SPTS/worker/getWorkers.php")
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    setTableValues(res.Workers);
                    console.log(res.Workers);
                })
                .catch((err) => {
                    console.log("err in fetching", err);
                    setTableValues([]);
                });
        } catch (err) {
            console.log("try catch error: ", err);
            setTableValues([]);
        }
    };

    React.useEffect(() => {
        fetchWorkers();
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

        fetch(api_endpoint + "/Jordan/SPTS/worker/getDesignations.php")
            .then((res) =>
                res.json().then((res) => {
                    console.log("res designations", res);
                    setDesignations(res.Designations);
                })
            )
            .catch((err) => {
                console.log("err in fetch", err);
            });
    }, []);

    return (
        <div>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid lg={6} md={6} sm={6} xs={6}>
                    <TextField
                        name='searchValue'
                        variant="outlined"
                        label="Search Worker"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon color='primary' style={{ cursor: 'pointer' }} />
                            </InputAdornment>
                        }}
                    // endAdornment={
                    //     <InputAdornment position="end">
                    //       <SearchIcon/>
                    //     </InputAdornment>
                    //   }
                    />
                </Grid>
            </div> */}
            <Dialog open={modalVisible}>
                <div style={{ padding: 20, width: 480 }}>
                    {editState ? (
                        <>
                            <div
                                style={{
                                    textAlign: "center",
                                    marginBottom: 15,
                                }}
                            >
                                <Typography variant="h6">
                                    {" "}
                                    Edit Worker
                                </Typography>
                            </div>
                            <Grid container>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <TextField
                                        value={editState.worker_code}
                                        onChange={(e) =>
                                            setEditState({
                                                ...editState,
                                                worker_code: e.target.value,
                                            })
                                        }
                                        name="workerId"
                                        variant="outlined"
                                        fullWidth
                                        label="Worker ID"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <TextField
                                        value={editState.worker_name}
                                        onChange={(e) =>
                                            setEditState({
                                                ...editState,
                                                worker_name: e.target.value,
                                            })
                                        }
                                        name="workerName"
                                        variant="outlined"
                                        fullWidth
                                        label="Worker Name"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <Autocomplete
                                        //id="combo-box-demo"
                                        options={deparments}
                                        getOptionLabel={(option) =>
                                            option.department_code
                                        }
                                        style={{ width: "100%" }}
                                        // disabled={true}
                                        onChange={(e, v) =>
                                            setEditState({
                                                ...editState,
                                                department_id: v.department_id,
                                                department_code:
                                                    v.department_code,
                                            })
                                        }
                                        defaultValue={() => {
                                            return {
                                                department_id:
                                                    editState.department_id,
                                                department_code:
                                                    editState.department_code,
                                            };
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Department"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <Autocomplete
                                        //id="combo-box-demo"
                                        options={designations}
                                        getOptionLabel={(option) =>
                                            option.designation_code
                                        }
                                        style={{ width: "100%" }}
                                        // disabled={true}
                                        onChange={(e, v) =>
                                            setEditState({
                                                ...editState,
                                                designator_id: v.designation_id,
                                                designator_code:
                                                    v.designation_code,
                                            })
                                        }
                                        defaultValue={() => {
                                            return {
                                                designation_id:
                                                    editState.designator_id,
                                                designation_code:
                                                    editState.designator_code,
                                            };
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Designation"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    style={{ padding: 5, width: "100%" }}
                                >
                                    <FormControlLabel
                                        label="Fixed Salary"
                                        control={
                                            <Switch
                                                checked={
                                                    editState.fixed_salary_flag
                                                }
                                                onChange={(event) => {
                                                    let state = 0;
                                                    if (
                                                        editState.fixed_salary_flag ===
                                                        0
                                                    ) {
                                                        state = 1;
                                                    } else {
                                                        state = 0;
                                                    }
                                                    setEditState({
                                                        ...editState,
                                                        fixed_salary_flag: state,
                                                    });
                                                }}
                                                color="primary"
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={{
                                            color: "#fff",
                                            height: "50px",
                                        }}
                                        fullWidth
                                        onClick={handleUpdate}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    style={{ padding: 5 }}
                                >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={{
                                            color: "#fff",
                                            height: "50px",
                                        }}
                                        fullWidth
                                        onClick={() => setModalVisible(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    ) : null}
                </div>
            </Dialog>
            <div style={{ display: "flex", justifyContent: "center" }}>
                {
                    tableValues === null ? (
                        <div
                            style={{
                                padding: 20,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress color="primary" />
                        </div>
                    ) : (
                        <MyTable
                            columns={[
                                {
                                    Header: "Worker ID",
                                    accessor: "worker_id",
                                },
                                {
                                    Header: "Code",
                                    accessor: "worker_code",
                                },
                                {
                                    Header: "Name",
                                    accessor: "worker_name",
                                },
                                {
                                    Header: "Department",
                                    accessor: "department_code",
                                },
                                {
                                    Header: "Designation",
                                    accessor: "designator_code",
                                },
                            ]}
                            data={tableValues}
                            tableValues={tableValues}
                            setModalValues={setModalValues}
                            setModalVisible={setModalVisible}
                        />
                    )
                    // <table style={{ height: 400, overflowY: 'scroll' }}>
                    //     <tr>
                    //         <th>Worker ID</th>
                    //         <th>Worker Code</th>
                    //         <th>Name</th>
                    //         <th style={{ width: '70px' }}></th>
                    //     </tr>
                    //     <tbody>
                    //         {
                    //             tableValues.map(v => (
                    //                 <tr>
                    //                     <td>{v.worker_id}</td>
                    //                     <td>{v.worker_code}</td>
                    //                     <td>{v.worker_name}</td>
                    //                     <td style={{ textAlign: 'center' }}><EditIcon color='primary' onClick={() => {
                    //                         setModalVisible(true)
                    //                         setModalValues(v)
                    //                     }} style={{ cursor: 'pointer', marginRight: 15 }} /></td>
                    //                 </tr>
                    //             ))
                    //         }

                    //     </tbody>
                    // </table>
                }
            </div>
        </div>
    );
};

export default withSnackbar(WorkersTable);
