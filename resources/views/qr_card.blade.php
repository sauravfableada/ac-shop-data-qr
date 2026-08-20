<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Card - {{ $acUnit->ac_code }}</title>
    <style>
        body {
            background-color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }
        .qr-card-container {
            background-color: #ffffff;
            width: 320px;
            height: 460px;
            border: 2px dashed #e2e8f0;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 20px;
            box-sizing: border-box;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .qr-image {
            width: 220px;
            height: 220px;
            margin-bottom: 20px;
        }
        .ac-code {
            font-size: 22px;
            font-weight: bold;
            color: #0f172a;
            margin: 0 0 10px 0;
        }
        .customer-name {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 8px 0;
        }
        .ac-details {
            font-size: 14px;
            color: #64748b;
            margin: 0 0 20px 0;
        }
        .qr-token {
            font-size: 10px;
            color: #94a3b8;
            margin: auto 0 0 0;
            word-break: break-all;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="qr-card-container">
        <img class="qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data={{ $token }}" alt="QR Code">
        
        <h2 class="ac-code">{{ $acUnit->ac_code }}</h2>
        
        <p class="customer-name">{{ $acUnit->customer ? $acUnit->customer->full_name : '' }}</p>
        
        @if($acUnit->brand)
            <p class="ac-details">{{ $acUnit->brand }} {{ $acUnit->model }}</p>
        @endif
        
        <p class="qr-token">{{ $token }}</p>
    </div>
</body>
</html>
