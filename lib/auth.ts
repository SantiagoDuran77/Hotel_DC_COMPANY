export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "client" | "employee" | "reception"
  department?: string
  phone?: string
  documento_identidad?: string
  fecha_nacimiento?: string
  direccion?: string
  ciudad?: string
  pais?: string
  preferencias?: string
  avatar?: string
  position?: string
  rating?: number
  specialties?: string[]
}

// Usuarios predefinidos del sistema
const users: User[] = [
  // Administrador
  {
    id: "1",
    email: "admin@hoteldc.com",
    name: "Administrador DC",
    role: "admin",
    phone: "+1234567890",
    documento_identidad: "12345678A",
    direccion: "Oficina Central Hotel DC",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=AD",
  },
  // Recepcionista
  {
    id: "2",
    email: "recepcion@hoteldc.com",
    name: "María Recepción",
    role: "reception",
    department: "Recepción",
    phone: "+1234567891",
    documento_identidad: "87654321B",
    direccion: "Hotel DC Company",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=RC",
  },
  // Empleados
  {
    id: "employee1",
    email: "spa@hoteldc.com",
    name: "Ana Spa",
    role: "employee",
    department: "Spa",
    phone: "+1234567892",
    documento_identidad: "11111111C",
    direccion: "Hotel DC Company",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=AS",
    position: "Terapeuta de Spa",
    rating: 4.8,
    specialties: ["Masajes relajantes", "Aromaterapia", "Reflexología"],
  },
  {
    id: "employee2",
    email: "cocina@hoteldc.com",
    name: "Carlos Chef",
    role: "employee",
    department: "Cocina",
    phone: "+1234567893",
    documento_identidad: "22222222D",
    direccion: "Hotel DC Company",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=CC",
    position: "Chef Ejecutivo",
    rating: 4.9,
    specialties: ["Cocina internacional", "Repostería", "Servicio a la habitación"],
  },
  {
    id: "employee3",
    email: "transporte@hoteldc.com",
    name: "Pedro Transporte",
    role: "employee",
    department: "Transporte",
    phone: "+1234567895",
    documento_identidad: "44444444F",
    direccion: "Hotel DC Company",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=PT",
    position: "Conductor Profesional",
    rating: 4.7,
    specialties: ["Tours de ciudad", "Traslados aeropuerto", "Servicio VIP"],
  },
  {
    id: "employee4",
    email: "limpieza@hoteldc.com",
    name: "Laura Limpieza",
    role: "employee",
    department: "Limpieza",
    phone: "+1234567894",
    documento_identidad: "33333333E",
    direccion: "Hotel DC Company",
    ciudad: "Madrid",
    pais: "España",
    avatar: "/placeholder.svg?height=40&width=40&text=LL",
    position: "Supervisora de Limpieza",
    rating: 4.6,
    specialties: ["Limpieza profunda", "Organización", "Mantenimiento"],
  },
  // Clientes
  {
    id: "7",
    email: "cliente1@ejemplo.com",
    name: "Juan Pérez",
    role: "client",
    phone: "+1234567896",
    documento_identidad: "55555555G",
    fecha_nacimiento: "1985-05-15",
    direccion: "Calle Principal 123",
    ciudad: "Barcelona",
    pais: "España",
    preferencias: "Habitación con vista al mar, desayuno continental",
    avatar: "/placeholder.svg?height=40&width=40&text=JP",
  },
  {
    id: "8",
    email: "cliente2@ejemplo.com",
    name: "María García",
    role: "client",
    phone: "+1234567897",
    documento_identidad: "66666666H",
    fecha_nacimiento: "1990-08-22",
    direccion: "Avenida Central 456",
    ciudad: "Valencia",
    pais: "España",
    preferencias: "Habitación silenciosa, servicio de spa",
    avatar: "/placeholder.svg?height=40&width=40&text=MG",
  },
  {
    id: "9",
    email: "cliente3@ejemplo.com",
    name: "Carlos Rodríguez",
    role: "client",
    phone: "+1234567898",
    documento_identidad: "77777777I",
    fecha_nacimiento: "1988-12-03",
    direccion: "Plaza Mayor 789",
    ciudad: "Sevilla",
    pais: "España",
    preferencias: "Habitación familiar, acceso al gimnasio",
    avatar: "/placeholder.svg?height=40&width=40&text=CR",
  },
]

export function login(email: string, password: string): User | null {
  // Contraseña universal para demo: 123456
  if (password !== "123456") {
    return null
  }

  const user = users.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return

  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("currentUser")
}

export function getDashboardRoute(user: User): string {
  switch (user.role) {
    case "admin":
      return "/admin"
    case "reception":
      return "/reception"
    case "employee":
      return "/employee"
    case "client":
      return "/dashboard"
    default:
      return "/"
  }
}

export function register(userData: Omit<User, "id">): User {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  }

  setCurrentUser(newUser)
  return newUser
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function isEmployee(user: User | null): boolean {
  return user?.role === "employee"
}

export function isCustomer(user: User | null): boolean {
  return user?.role === "client"
}

export function isReceptionist(user: User | null): boolean {
  return user?.role === "reception"
}

// Missing functions that were causing build errors
export function hasAdminAccess(user: User | null): boolean {
  return user?.role === "admin"
}

export function hasReceptionAccess(user: User | null): boolean {
  return user?.role === "reception" || user?.role === "admin"
}

export function getEmployeeById(employeeId: string): User | null {
  return users.find((user) => user.id === employeeId && user.role === "employee") || null
}

export function getAllEmployees(): User[] {
  return users.filter((user) => user.role === "employee")
}

export function getAllUsers(): User[] {
  return users
}
