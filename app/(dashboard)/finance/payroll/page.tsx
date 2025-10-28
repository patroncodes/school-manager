import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, DollarSign, Download, Users } from "lucide-react"

const PayrollManagement = async () => {
    const getStatusBadge = (status: string) => {
        const variants = {
            PAID: "default",
            PROCESSING: "secondary",
            PENDING: "outline",
            FAILED: "destructive",
        } as const

        return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
    }

    // const totalStaff = staffData.length
    // const totalGrossSalary = staffData.reduce(
    //     (sum, staff) => sum + staff.basicSalary + Object.values(staff.allowances).reduce((a, b) => a + b, 0),
    //     0,
    // )
    // const totalDeductions = staffData.reduce(
    //     (sum, staff) => sum + Object.values(staff.deductions).reduce((a, b) => a + b, 0),
    //     0,
    // )
    // const totalNetSalary = totalGrossSalary - totalDeductions

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Payroll Management</h1>
                    <p className="text-muted-foreground">Manage staff salaries and payroll processing</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Payroll
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{0}</div>
                        <p className="text-xs text-muted-foreground">Active employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Gross Salary</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(240 / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">Monthly total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Deductions</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(320 / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">Tax, pension, NHIS</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net Payable</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{(10 / 1000000).toFixed(1)}M</div>
                        <p className="text-xs text-muted-foreground">After deductions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="staff" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="staff">Staff Salaries</TabsTrigger>
                    <TabsTrigger value="history">Payroll History</TabsTrigger>
                </TabsList>

                <TabsContent value="staff" className="space-y-4">
                    {/* Filters */}
                    {/* <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name, position, or employee ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        <SelectItem value="administration">Administration</SelectItem>
                                        <SelectItem value="sciences">Sciences</SelectItem>
                                        <SelectItem value="arts">Arts</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Staff Table */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Staff Salaries ({filteredStaff.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Basic Salary</TableHead>
                                        <TableHead>Allowances</TableHead>
                                        <TableHead>Deductions</TableHead>
                                        <TableHead>Net Salary</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStaff.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{staff.name}</p>
                                                    <p className="text-sm text-muted-foreground">{staff.employeeId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{staff.position}</TableCell>
                                            <TableCell>{staff.department}</TableCell>
                                            <TableCell>₦{staff.basicSalary.toLocaleString()}</TableCell>
                                            <TableCell>
                                                ₦
                                                {Object.values(staff.allowances)
                                                    .reduce((a, b) => a + b, 0)
                                                    .toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                ₦
                                                {Object.values(staff.deductions)
                                                    .reduce((a, b) => a + b, 0)
                                                    .toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-medium">₦{staff.netSalary.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card> */}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    {/* Payroll History */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Payroll History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Staff Count</TableHead>
                                        <TableHead>Gross Amount</TableHead>
                                        <TableHead>Deductions</TableHead>
                                        <TableHead>Net Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment Date</TableHead>
                                        <TableHead>Processed By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payrollHistoryData.map((payroll) => (
                                        <TableRow key={payroll.id}>
                                            <TableCell className="font-medium">{payroll.month}</TableCell>
                                            <TableCell>{payroll.totalStaff}</TableCell>
                                            <TableCell>₦{payroll.totalGross.toLocaleString()}</TableCell>
                                            <TableCell>₦{payroll.totalDeductions.toLocaleString()}</TableCell>
                                            <TableCell className="font-medium">₦{payroll.totalNet.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                                            <TableCell>{payroll.paymentDate || "-"}</TableCell>
                                            <TableCell>{payroll.processedBy || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card> */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PayrollManagement