"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Download, Eye, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

// Mock data based on Nigerian school context and Payment schema
const paymentsData = [
    {
        id: "PAY-2024-001",
        reference: "TXN-001-2024",
        amount: 45000,
        currency: "NGN",
        paymentDate: "2024-01-15",
        narration: "First Term School Fees Payment",
        payerName: "Mr. Johnson Adebayo",
        method: "Bank Transfer",
        status: "SUCCESS",
        providerReference: "GTB-TXN-123456789",
        invoice: {
            number: "INV-2024-001",
            student: "Adebayo Johnson",
            class: "SS3A",
        },
    },
    {
        id: "PAY-2024-002",
        reference: "TXN-002-2024",
        amount: 38000,
        currency: "NGN",
        paymentDate: "2024-01-18",
        narration: "School Fees - JSS2B",
        payerName: "Mrs. Fatima Ibrahim",
        method: "POS",
        status: "PENDING",
        providerReference: "POS-REF-987654321",
        invoice: {
            number: "INV-2024-002",
            student: "Fatima Ibrahim",
            class: "JSS2B",
        },
    },
    {
        id: "PAY-2024-003",
        reference: "TXN-003-2024",
        amount: 20000,
        currency: "NGN",
        paymentDate: "2024-01-12",
        narration: "Partial Payment - SS1C",
        payerName: "Mr. Chidi Okafor",
        method: "Cash",
        status: "SUCCESS",
        providerReference: "CASH-001",
        invoice: {
            number: "INV-2024-003",
            student: "Chidi Okafor",
            class: "SS1C",
        },
    },
    {
        id: "PAY-2024-004",
        reference: "TXN-004-2024",
        amount: 40000,
        currency: "NGN",
        paymentDate: "2024-01-20",
        narration: "JSS3A School Fees",
        payerName: "Alhaji Mohammed Aisha",
        method: "Online Transfer",
        status: "FAILED",
        providerReference: "FLUTTERWAVE-FAIL-001",
        invoice: {
            number: "INV-2024-004",
            student: "Aisha Mohammed",
            class: "JSS3A",
        },
    },
    {
        id: "PAY-2024-005",
        reference: "TXN-005-2024",
        amount: 15000,
        currency: "NGN",
        paymentDate: "2024-01-22",
        narration: "Refund - Overpayment",
        payerName: "Mrs. Grace Emeka",
        method: "Bank Transfer",
        status: "REFUNDED",
        providerReference: "REFUND-GTB-001",
        invoice: {
            number: "INV-2024-005",
            student: "Emeka Nwankwo",
            class: "Primary 6A",
        },
    },
]

function RecordPaymentDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Record Manual Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="invoice">Invoice</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inv1">INV-2024-001 - Adebayo Johnson</SelectItem>
                                    <SelectItem value="inv2">INV-2024-002 - Fatima Ibrahim</SelectItem>
                                    <SelectItem value="inv3">INV-2024-003 - Chidi Okafor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="amount">Amount (₦)</Label>
                            <Input type="number" placeholder="0.00" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="method">Payment Method</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="pos">POS</SelectItem>
                                    <SelectItem value="online">Online Payment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="paymentDate">Payment Date</Label>
                            <Input type="date" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="payerName">Payer Name</Label>
                        <Input placeholder="Name of person making payment" />
                    </div>

                    <div>
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input placeholder="Bank reference or receipt number" />
                    </div>

                    <div>
                        <Label htmlFor="narration">Narration</Label>
                        <Textarea placeholder="Payment description or notes" />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Record Payment</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PaymentDetailsDialog({ payment }: { payment: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Payment Details - {payment.reference}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Reference</Label>
                            <p className="font-medium">{payment.reference}</p>
                        </div>
                        <div>
                            <Label>Amount</Label>
                            <p className="font-medium">₦{payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <Label>Payment Date</Label>
                            <p>{payment.paymentDate}</p>
                        </div>
                        <div>
                            <Label>Method</Label>
                            <p>{payment.method}</p>
                        </div>
                        <div>
                            <Label>Payer Name</Label>
                            <p>{payment.payerName}</p>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Badge
                                variant={
                                    payment.status === "SUCCESS"
                                        ? "default"
                                        : payment.status === "PENDING"
                                            ? "secondary"
                                            : payment.status === "FAILED"
                                                ? "destructive"
                                                : "outline"
                                }
                            >
                                {payment.status}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <Label>Invoice Details</Label>
                        <div className="border rounded p-3 mt-2">
                            <p>
                                <strong>Invoice:</strong> {payment.invoice.number}
                            </p>
                            <p>
                                <strong>Student:</strong> {payment.invoice.student}
                            </p>
                            <p>
                                <strong>Class:</strong> {payment.invoice.class}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Label>Narration</Label>
                        <p className="text-sm text-muted-foreground">{payment.narration}</p>
                    </div>

                    {payment.providerReference && (
                        <div>
                            <Label>Provider Reference</Label>
                            <p className="text-sm font-mono">{payment.providerReference}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                        </Button>
                        {payment.status === "FAILED" && (
                            <Button variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry Payment
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function PaymentsTracking() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [methodFilter, setMethodFilter] = useState("all")

    const filteredPayments = paymentsData.filter((payment) => {
        const matchesSearch =
            payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.invoice.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()
        const matchesMethod = methodFilter === "all" || payment.method.toLowerCase().includes(methodFilter.toLowerCase())

        return matchesSearch && matchesStatus && matchesMethod
    })

    const getStatusBadge = (status: string) => {
        const config = {
            SUCCESS: { variant: "default" as const, icon: CheckCircle },
            PENDING: { variant: "secondary" as const, icon: Clock },
            FAILED: { variant: "destructive" as const, icon: XCircle },
            PROCESSING: { variant: "secondary" as const, icon: RefreshCw },
            REFUNDED: { variant: "outline" as const, icon: RefreshCw },
        }

        const { variant, icon: Icon } = config[status as keyof typeof config] || config.PENDING

        return (
            <Badge variant={variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {status}
            </Badge>
        )
    }

    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const successfulPayments = filteredPayments.filter((p) => p.status === "SUCCESS")
    const pendingPayments = filteredPayments.filter((p) => p.status === "PENDING")
    const failedPayments = filteredPayments.filter((p) => p.status === "FAILED")

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Payments Tracking</h1>
                    <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <RecordPaymentDialog />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{filteredPayments.length} transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">{successfulPayments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ₦{successfulPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingPayments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ₦{pendingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{failedPayments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            ₦{failedPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by reference, payer name, student, or invoice..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={methodFilter} onValueChange={setMethodFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="transfer">Bank Transfer</SelectItem>
                                <SelectItem value="pos">POS</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Student/Invoice</TableHead>
                                <TableHead>Payer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.reference}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{payment.invoice.student}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {payment.invoice.number} • {payment.invoice.class}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{payment.payerName}</TableCell>
                                    <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell>{payment.paymentDate}</TableCell>
                                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                    <TableCell>
                                        <PaymentDetailsDialog payment={payment} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
