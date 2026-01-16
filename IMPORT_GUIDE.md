# Portfolio Import Feature

## Overview
Power Trading now supports importing your existing stock portfolio from popular trading platforms like Robinhood, Public, and Webull. This allows you to seamlessly transfer your holdings and get instant AI-powered recommendations from Mario and Luigi.

## Supported Platforms
- **Robinhood** - Import via CSV export
- **Public** - Import via CSV export  
- **Webull** - Import via CSV export
- **Generic JSON** - Custom JSON format support

## How to Import

### Step 1: Export from Your Platform

#### Robinhood
1. Open the Robinhood app or website
2. Go to Account → Menu
3. Select Statements & History
4. Choose Account Statements
5. Export as CSV

#### Public
1. Go to your Public profile
2. Navigate to Settings
3. Select Export Portfolio
4. Download CSV

#### Webull
1. Open your Webull account
2. Go to Account → History
3. Select Holdings
4. Click Export
5. Save as CSV

### Step 2: Import to Power Trading
1. Click the "Import Portfolio" button in the header
2. Select your trading platform
3. Upload your exported CSV file
4. Review the parsed holdings
5. Confirm import

## File Format Requirements

### CSV Format
The import parser automatically detects columns with these keywords:
- **Symbol/Ticker**: Stock symbol (e.g., AAPL)
- **Name/Description**: Company name
- **Quantity/Shares/Amount**: Number of shares
- **Average/Avg/Cost Basis**: Average purchase price
- **Current/Market/Last Price**: Current market price

### JSON Format
```json
{
  "positions": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 10,
      "average_buy_price": 150.00,
      "current_price": 178.50
    }
  ]
}
```

## Sample Files
Download sample files to test the import feature:
- Use the "Sample CSV" button in the import dialog
- Sample files include 5 popular tech stocks
- Test the parsing before importing real data

## What Happens After Import
1. **Holdings Added**: All positions are added to your Power Trading portfolio
2. **Stocks Created**: Any new stocks are automatically added to the market
3. **Token Supply**: Available tokens are adjusted based on imported quantities
4. **AI Analysis Ready**: Mario and Luigi can immediately analyze your portfolio
5. **Gain/Loss Calculated**: Performance metrics are computed from your average prices

## Important Notes
- Imported stocks start in the "Imported" category
- Token supply is limited to 1,000 tokens per stock
- If you import more than available supply, the system adjusts accordingly
- You can import multiple times - holdings are merged, not replaced
- Duplicate symbols are combined with recalculated average prices

## Troubleshooting

### "No valid holdings found in file"
- Check that your CSV has the required columns
- Ensure quantity values are greater than 0
- Verify the file is properly formatted

### "Invalid JSON format"
- Validate your JSON structure
- Ensure all quotes and brackets are properly closed
- Use a JSON validator before uploading

### "Failed to parse file"
- Try downloading and importing a sample file first
- Check that column headers match expected keywords
- Ensure numeric values don't have invalid characters

## Privacy & Security
- No data is sent to external servers
- All parsing happens locally in your browser
- Your portfolio data is stored only in your browser's local storage
- Files are not retained after import
