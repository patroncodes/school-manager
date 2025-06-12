"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Admin } from "@prisma/client"
import { AlertTriangle, BarChart3, Database, FileText, Settings, Shield, TrendingUp, Users } from "lucide-react"

interface AdminProfileProps {
    admin: Admin
}

export default function AdminProfile() {

    return (
        <div className="space-y-6">
            {/* Admin Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{admin.name} {admin.surname}</div>
                    </CardContent>
                </Card> */}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,247</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">892</div>
                        <p className="text-xs text-muted-foreground">Currently enrolled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">67</div>
                        <p className="text-xs text-muted-foreground">Active faculty</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <p className="text-xs text-muted-foreground">Uptime this month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-medium">User Management</h3>
                        <p className="text-sm text-muted-foreground">Manage users & roles</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-medium">Reports</h3>
                        <p className="text-sm text-muted-foreground">Analytics & reports</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                        <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="font-medium">System Settings</h3>
                        <p className="text-sm text-muted-foreground">Configure system</p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h3 className="font-medium">Audit Logs</h3>
                        <p className="text-sm text-muted-foreground">System activity</p>
                    </CardContent>
                </Card>
            </div>

            {/* System Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        System Alerts
                    </CardTitle>
                    <CardDescription>Important system notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Database Backup Scheduled</p>
                                <p className="text-sm text-muted-foreground">Automatic backup will run tonight at 2:00 AM</p>
                                <p className="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">New User Registration</p>
                                <p className="text-sm text-muted-foreground">5 new parent accounts created today</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">System Update Completed</p>
                                <p className="text-sm text-muted-foreground">Security patches applied successfully</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Administrative Activities</CardTitle>
                    <CardDescription>Your recent system management activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">User Role Updated</p>
                                <p className="text-sm text-muted-foreground">Changed John Doe from Teacher to Department Head</p>
                                <p className="text-xs text-muted-foreground">30 minutes ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">System Configuration</p>
                                <p className="text-sm text-muted-foreground">Updated payment gateway settings</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Report Generated</p>
                                <p className="text-sm text-muted-foreground">Monthly financial report exported</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
