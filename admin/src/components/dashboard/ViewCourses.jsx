import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  doGetCourseList,
  doEditCourseList,
  doDeleteCourse,
} from "../../redux/actions";

function ViewCourses() {
  const [getCourses, setCourses] = useState([]);
  const dispatch = useDispatch();
  const store = useSelector((state) => state.store);

  const columns = [
    {
      title: "Tên khóa học",
      field: "name",
      cellStyle: { width: "20%" },
    },
    {
      title: "Tên giảng viên",
      field: "instructorName",
      cellStyle: { width: "12%" },
      editable: "never",
    },
    {
      title: "Giá tiền",
      field: "price",
      cellStyle: { width: "10%" },
      render: (rowData) => (
        <Price>{rowData.price ? `${rowData.price}$` : "Miễn phí"}</Price>
      ),
    },
    {
      title: "Email Gỉang viên",
      field: "email",
      cellStyle: { width: "15%" },
      editable: "never",
    },
    {
      title: "Hình ảnh khoá học",
      field: "image",
      cellStyle: { width: "15%" },
      render: (rowData) =>
        rowData.image && (
          <Image>
            <img src={rowData.image} style={{ height: 50 }} />,
          </Image>
        ),
      editable: "never",
    },
    {
      title: "Trạng thái",
      field: "isPublished",
      cellStyle: { width: "10%" },
      render: (rowData) => (
        <Price>{rowData.isPublished ? "Đã xuất bản" : `Riêng tư`}</Price>
      ),
      lookup: { 1: "Xuất bản", 0: "Riêng tư" },
    },
  ];

  useEffect(() => {
    dispatch(doGetCourseList());
  }, []);

  useEffect(() => {
    if (store.courseList.courses?.length > 1) {
      setCourses(store.courseList.courses);
    }
  }, [store.courseList.courses]);

  const handleEditRow = (newValue, oldValue, rowData, columnDef) => {
    let body = {
      [columnDef.field]: newValue,
    };

    return new Promise((resolve, reject) => {
      dispatch(doEditCourseList(rowData.id, body));
      dispatch(doGetCourseList());
      setTimeout(resolve, 0);
    });
  };

  const optionStyles = () => ({
    actionsColumnIndex: -1,
    pageSize: 10,
    headerStyle: {
      backgroundColor: "#039be5",
      color: "#FFF",
    },
    rowStyle: {
      backgroundColor: "#EEE",
      padding: 5,
    },
  });

  const handleEditable = () => ({
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const dataDelete = [...getCourses];
          const index = oldData.tableData.id;
          dataDelete.splice(index, 1);
          setCourses([...dataDelete]);
          dispatch(doDeleteCourse(oldData.id));
          resolve();
        }, 0);
      }),
  });

  return (
    <Wrap>
      <MaterialTable
        title={"Danh sách khóa học - " + getCourses?.length + " khoá học"}
        style={{ padding: 10 }}
        data={getCourses}
        columns={columns}
        options={optionStyles()}
        editable={handleEditable()}
        cellEditable={{
          cellStyle: {},
          onCellEditApproved: handleEditRow,
        }}
      />
    </Wrap>
  );
}

export default ViewCourses;

const Wrap = styled.div`
  background-color: white;
  width: 80vw;
  height: 90vh;
  overflow-y: auto;
  padding: 1rem 1rem;
`;

const Price = styled.div`
  background-color: white;
  padding: 2px 4px;
  margin-right: 10px;
  border-radius: 8px;
`;

const Image = styled.div`
  display: flex;
`;
