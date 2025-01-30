import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../Base Components/ToastNotification";
import { AppProvider } from "@toolpad/core/AppProvider";
import {
  Alert,
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CancelScheduleSendOutlined from "@mui/icons-material/CancelScheduleSendOutlined";
import Input from "../../Base Components/Input";
import AirplaneTicketIcon from "../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg";
import "../../styles/UserDashboard.css"; // 📌 CSS dosyası eklendi.

const UserDashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filter, setFilter] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  // **Pagination (Sayfalama) için State**
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!token) {
      showToast("info", "Oturum süresi dolmuştur.Lütfen tekrar giriş yapınız.");
      navigate("/login");
    } else {
      fetchFlights();
    }
  }, [token, navigate]);

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/flights/searchById", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(response.data);
      setFilteredFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      showToast("error", "Uçuşlar yüklenirken bir hata oluştu.");
    }
  };

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    const filtered = flights.filter((flight) => {
      return (
        (name !== "departure" ||
          !value ||
          flight.departureAirport?.city
            ?.toLowerCase()
            .includes(value.toLowerCase())) &&
        (name !== "arrival" ||
          !value ||
          flight.arrivalAirport?.city
            ?.toLowerCase()
            .includes(value.toLowerCase())) &&
        (name !== "date" || !value || flight.departureTime?.includes(value))
      );
    });

    setFilteredFlights(filtered);
  };

  const handleClearFilters = () => {
    setFilter({ departure: "", arrival: "", date: "" });
    setFilteredFlights(flights);
  };

  const handleLogout = () => {
    logout(() => {
      showToast("info", "Başarıyla çıkış yapıldı.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    });
  };

  // 📌 **Tablo Renklendirme Fonksiyonu**
  const getTextColor = (departureTime) => {
    const now = new Date();
    const flightDate = new Date(departureTime);
    const diffInDays = Math.floor((flightDate - now) / (1000 * 60 * 60 * 24));

    if (flightDate < now) {
      return "red"; // Geçmiş uçuşlar
    } else if (diffInDays <= 3) {
      return "orange"; // Yakın tarihli uçuşlar
    } else {
      return "blue"; // Uzak tarihli uçuşlar
    }
  };

  // 📌 **Sayfalama için event handler**
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AppProvider>
      <Box className="user-dashboard">
        {/* 📌 **Header** */}
        <Box className="user-dashboard-header">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={AirplaneTicketIcon} alt="Flight Logo" />
            <Typography variant="h6">Uçuş Takip Programı</Typography>
          </Box>
          <IconButton className="user-dashboard-logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* 📌 **İçerik** */}
        <Box className="user-dashboard-content">
          <Typography variant="h5">Uçuş Listesi</Typography>
<Alert severity="info">
          <strong>Uçuş Renk Kodları:</strong>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li><span style={{ color: "red", fontWeight: "bold" }}>Kırmızı</span>: Geçmiş tarihli uçuşlar</li>
            <li><span style={{ color: "orange", fontWeight: "bold" }}>Turuncu</span>: 3 gün içinde olan uçuşlar</li>
            <li><span style={{ color: "blue", fontWeight: "bold" }}>Mavi</span>: 3 günden daha ileri tarihli uçuşlar</li>
          </ul>
        </Alert>
          {/* 📌 **Filtreleme Alanı** */}
          <Box className="user-dashboard-filters">
            <Input name="departure" label="Kalkış Şehri" value={filter.departure} onChange={handleFilterChange} />
            <Input name="arrival" label="Varış Şehri" value={filter.arrival} onChange={handleFilterChange} />
            <Input name="date" label="" type="date" value={filter.date} onChange={handleFilterChange} />

            {/* 📌 **Temizle Butonu** */}
            <IconButton className="user-dashboard-clear-btn" onClick={handleClearFilters}>
              <CancelScheduleSendOutlined />
            </IconButton>
          </Box>

          {/* 📌 **Uçuş Listesi + Pagination** */}
          <TableContainer component={Paper} className="user-dashboard-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kalkış Şehri</TableCell>
                  <TableCell>Varış Şehri</TableCell>
                  <TableCell>Kalkış Saati</TableCell>
                  <TableCell>Varış Saati</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((flight) => {
                  const textColor = getTextColor(flight.departureTime);
                  return (
                    <TableRow key={flight.id}>
                      <TableCell sx={{ color: textColor }}>{flight.departureAirport?.city || "Unknown"}</TableCell>
                      <TableCell sx={{ color: textColor }}>{flight.arrivalAirport?.city || "Unknown"}</TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: textColor }}>
                        {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 📌 **Pagination** */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFlights.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </AppProvider>
  );
};

export default UserDashboard;
