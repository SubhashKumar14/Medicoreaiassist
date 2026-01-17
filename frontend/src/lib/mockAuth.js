/**
 * Mock Authentication Service
 * Simulates a backend by storing user data in localStorage
 */

const STORAGE_KEY = 'medai_users';
const CURRENT_USER_KEY = 'medai_current_user';
const MASTER_PASSWORD = 'medicoredr';

// Initial Data Seeding
const seedData = () => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) {
        const initialUsers = [
            // Super Admin
            {
                id: 'admin-1',
                name: 'Super Admin',
                email: 'admin@subhash.com',
                password: 'subhash14', // In a real app, this would be hashed
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            // Demo Doctors (Pending by default, or Active? Let's make them Pending to test approval flow, 
            // unless User login with master password which auto-approves)
            // User request: "keep 5 demo doctors account"
            // Let's make 3 Pending and 2 Active for variety in the UI
            {
                id: 'doc-1',
                name: 'Dr. Emily Watson',
                email: 'test1@dr.com',
                password: 'password',
                role: 'doctor',
                specialty: 'Cardiology',
                status: 'active',
                phone: '+1 (555) 123-4567',
                createdAt: new Date().toISOString()
            },
            {
                id: 'doc-2',
                name: 'Dr. Michael Brown',
                email: 'test2@dr.com',
                password: 'password',
                role: 'doctor',
                specialty: 'Neurology',
                status: 'pending',
                phone: '+1 (555) 234-5678',
                createdAt: new Date().toISOString()
            },
            {
                id: 'doc-3',
                name: 'Dr. Sarah Smith',
                email: 'test3@dr.com',
                password: 'password',
                role: 'doctor',
                specialty: 'Pediatrics',
                status: 'active',
                phone: '+1 (555) 345-6789',
                createdAt: new Date().toISOString()
            },
            {
                id: 'doc-4',
                name: 'Dr. James Wilson',
                email: 'test4@dr.com',
                password: 'password',
                role: 'doctor',
                specialty: 'General Medicine',
                status: 'pending',
                phone: '+1 (555) 456-7890',
                createdAt: new Date().toISOString()
            },
            {
                id: 'doc-5',
                name: 'Dr. Lisa Chen',
                email: 'test5@dr.com',
                password: 'password',
                role: 'doctor',
                specialty: 'Dermatology',
                status: 'pending',
                phone: '+1 (555) 567-8901',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
        console.log('Mock Auth: Seeded initial users');
    }
};

// Initialize on load
seedData();

const mockAuth = {
    // Register a new user
    register: (userData) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error("Email already registered");
        }

        // Validate Status based on Role
        let status = 'active'; // Patients are active by default
        if (userData.role === 'doctor') {
            status = 'pending'; // Doctors require approval
        }

        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            status,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        return newUser;
    },

    // Login
    login: (email, password) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Master Password Check for Doctors
        if (user.role === 'doctor' && password === MASTER_PASSWORD) {
            // Auto-approve if pending
            if (user.status === 'pending') {
                user.status = 'active';
                // Update in storage
                const updatedUsers = users.map(u => u.id === user.id ? user : u);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
                console.log(`Mock Auth: Auto-approved doctor ${user.email} via master password`);
            }
            return mockAuth.createSession(user);
        }

        // Normal Password Check
        if (user.password !== password) {
            throw new Error("Invalid credentials");
        }

        // Status Check
        if (user.status === 'pending') {
            throw new Error("Account pending approval. Please contact admin.");
        }

        if (user.status === 'suspended') {
            throw new Error("Account suspended. Contact support.");
        }

        return mockAuth.createSession(user);
    },

    // Helper to create session
    createSession: (user) => {
        const token = `mock-token-${user.id}-${Date.now()}`;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { user, token };
    },

    // Logout
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // Admin: Get all users
    getUsers: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },

    // Admin: Update user status
    updateUserStatus: (userId, status, reason) => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) throw new Error("User not found");

        users[userIndex].status = status;
        if (reason) {
            users[userIndex].statusReason = reason;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        return users[userIndex];
    }
};

export default mockAuth;
