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
import FilterListIcon from "@mui/icons-material/FilterAlt";
import CancelScheduleSendOutlined from "@mui/icons-material/Backspace";
import Input from "../../Base Components/Input";
import AirplaneTicketIcon from "../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg";
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filter, setFilter] = useState({
    departureCity: "",
    arrivalCity: "",
    departureDate: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!token) {
      showToast("info", "Oturum süresi dolmuştur. Lütfen tekrar giriş yapınız.");
      navigate("/login");
    } else {
      fetchFlights();
    }
  }, [token, navigate]);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(`${API_URL}/api/flights/searchById`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setFlights(response.data);
      setFilteredFlights(response.data);
  
    } catch (error) {
      console.error("Uçuşlar yüklenirken hata oluştu:", error);
  
      const errorMessage =
        error.response?.data?.message || "Uçuşlar yüklenirken bir hata oluştu.";
  
      showToast("error", errorMessage);
    }
  };
  

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  // 📌 Backend ile Filtreleme API'sini çağıran yeni fonksiyon
  const handleFilterApply = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/flights/filter`, filter, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setFilteredFlights(response.data);
    } catch (error) {
      console.error("Filtre uygulanırken hata oluştu:", error);
      showToast("error", "Filtreleme sırasında bir hata oluştu.");
    }
  };

  // 📌 Kullanıcının girdiği filtreleri güncelleyen fonksiyon
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Filtreleri temizleme fonksiyonu
  const handleClearFilters = () => {
    setFilter({ departureCity: "", arrivalCity: "", departureDate: "" });
    fetchFlights(); // Filtreleri temizleyince tüm uçuşları yeniden getir
  };
  const handleLogout = () => {
    logout(() => {
      showToast("info", "Başarıyla çıkış yapıldı.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    });
  };
  const getTextColor = (departureTime) => {
    const now = new Date();
    const flightDate = new Date(departureTime);
    const diffInDays = Math.floor((flightDate - now) / (1000 * 60 * 60 * 24));

    if (flightDate < now) {
      return "red"; 
    } else if (diffInDays <= 3) {
      return "orange"; 
    } else {
      return "blue"; 
    }
  };

  return (
    <AppProvider>
      <Box className="user-dashboard">
        <Box className="user-dashboard-header">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={AirplaneTicketIcon} alt="Flight Logo" />
            <Typography variant="h6">Uçuş Takip Programı</Typography>
          </Box>
          <IconButton className="user-dashboard-logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

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
      <Box className="user-dashboard-filters">
        <Input name="departureCity" label="Kalkış Şehri" value={filter.departureCity} onChange={handleFilterChange} />
        <Input name="arrivalCity" label="Varış Şehri" value={filter.arrivalCity} onChange={handleFilterChange} />
        <Input name="departureDate" label="" type="date" value={filter.departureDate} onChange={handleFilterChange} />

        <IconButton className="user-dashboard-filter-btn" onClick={handleFilterApply}>
          <FilterListIcon />
        </IconButton>

        <IconButton className="user-dashboard-clear-btn" onClick={handleClearFilters}>
          <CancelScheduleSendOutlined />
        </IconButton>
      </Box>

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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredFlights.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
      </Box>
    </AppProvider>
  );
};

export default UserDashboard;
