<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Service & Income Report</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 0; }
        
        .header-table { width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px; }
        .header-table td { vertical-align: top; }
        .header-logo { width: 250px; }
        .header-logo img { max-width: 150px; }
        
        .header-company { text-align: right; line-height: 1.4; }
        .header-company h1 { margin: 0; font-size: 16px; color: #000; text-transform: uppercase; font-weight: bold; }
        .header-company p { margin: 0; font-size: 11px; color: #000; }
        
        .report-title-container { width: 100%; margin-bottom: 15px; }
        .report-title-container td { vertical-align: middle; }
        .report-title { font-size: 14px; font-weight: bold; color: #333; border-left: 3px solid #9ca3af; padding-left: 8px; }
        .report-date { text-align: right; font-weight: bold; font-size: 11px; }
        
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data th, table.data td { border: 1px solid #e5e7eb; padding: 10px 8px; text-align: center; }
        table.data th { background-color: #f59e0b; color: white; font-weight: bold; padding: 12px 8px; }
        table.data tr:nth-child(even) { background-color: #f9fafb; }
        
        .grand-total-container { margin-top: 20px; margin-bottom: 20px; }
        .grand-total-label { font-weight: bold; font-size: 12px; margin-right: 10px; display: inline-block; vertical-align: middle; }
        .grand-total-value { display: inline-block; background-color: #eff6ff; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; color: #1e3a8a; border: 1px solid #dbeafe; vertical-align: middle; }
        
        .totals-table { width: auto; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        .totals-table td { padding: 6px 12px; border: 1px solid #e5e7eb; font-size: 11px; }
        .totals-label { background-color: #f9fafb; font-weight: bold; color: #4b5563; }
        .totals-val { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    
    <table class="header-table">
        <tr>
            <td class="header-logo">
                @if(isset($settings['company_logo']) && $settings['company_logo'])
                    <img src="{{ public_path(ltrim($settings['company_logo'], '/')) }}" alt="Company Logo" style="max-width: 150px; max-height: 60px;">
                @else
                    <h2 style="margin:0; color:#ef4444; font-size: 20px; font-style: italic;">{{ $settings['company_name'] ?? 'AC ShopData' }}</h2>
                @endif
            </td>
            <td class="header-company">
                <h1>{{ $settings['company_name'] ?? 'FABLEAD DEVELOPERS TECHNOLAB' }}</h1>
                @if(isset($settings['address']) && $settings['address'])
                    <p>{{ $settings['address'] }}</p>
                @endif
                <p>
                    @if(isset($settings['company_number']) && $settings['company_number']) PHONE: {{ $settings['company_number'] }} @endif
                    @if(isset($settings['company_number']) && $settings['company_number'] && isset($settings['company_email']) && $settings['company_email']) | @endif
                    @if(isset($settings['company_email']) && $settings['company_email']) EMAIL: {{ $settings['company_email'] }} @endif
                </p>
                @if(isset($settings['gst']) && $settings['gst'])
                    <p>GST: {{ $settings['gst'] }}</p>
                @endif
            </td>
        </tr>
    </table>

    <table class="report-title-container">
        <tr>
            <td class="report-title">
                Service & Income Report
                @if($startDate && $endDate)
                    <br><span style="font-size: 10px; font-weight: normal; color: #666;">Period: {{ $startDate->format('d M Y') }} to {{ $endDate->format('d M Y') }}</span>
                @endif
            </td>
            <td class="report-date">
                Report Date: {{ \Carbon\Carbon::now()->format('d M Y') }}
            </td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th>Service #</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>AC Unit</th>
                <th>Total Amount</th>
                <th>Service Status</th>
                <th>Payment Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($records as $row)
            <tr>
                <td>{{ $row->service_number }}</td>
                <td>{{ \Carbon\Carbon::parse($row->service_date)->format('d M Y') }}</td>
                <td>{{ $row->customer ? $row->customer->full_name : 'N/A' }}</td>
                <td>{{ $row->acUnit ? $row->acUnit->ac_code : 'N/A' }}</td>
                <td>{{ number_format($row->total_amount, 2) }}</td>
                <td style="text-transform: capitalize;">{{ $row->status }}</td>
                <td style="text-transform: capitalize;">{{ $row->payment_status }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">No records found for the selected filters.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="grand-total-container">
        <span class="grand-total-label">Grand Total (Billed)</span>
        <span class="grand-total-value">{{ number_format($totalBilled, 2) }}</span>
    </div>

    <table class="totals-table">
        <tr>
            <td class="totals-label">Total Received</td>
            <td class="totals-val" style="color: #10b981;">{{ number_format($totalPaid, 2) }}</td>
        </tr>
        <tr>
            <td class="totals-label">Total Pending</td>
            <td class="totals-val" style="color: #ef4444;">{{ number_format($totalPending, 2) }}</td>
        </tr>
    </table>

</body>
</html>
