# Finance App Features & Usage

## Overview

Caldane Finance is a personal finance management application that helps you track income and expenses through categories and transactions. The app enforces specific business rules to help you maintain organized financial records.

## Core Concepts

### Categories

Categories represent either income sources (profit) or spending areas (deficit). Each category has a reconciliation period that determines how often you expect transactions in that category.

#### Category Types

**Profit Categories (Income)**
- Represent sources of income
- Examples: Paycheck, Bonus, Freelance Income, Investment Returns
- Require explicit reconciliation period selection
- Available periods:
  - **Bi-weekly**: Every 2 weeks (e.g., regular paychecks)
  - **Semi-monthly**: Twice per month (1st and 15th)
  - **Monthly**: Once per month (e.g., salary)
  - **Yearly**: Annual income (e.g., tax returns)
  - **One-time**: Non-recurring payment (e.g., bonuses)

**Deficit Categories (Spending)**
- Represent areas of spending
- Examples: Grocery, Bills, Rent, Entertainment, Transportation
- Automatically assigned **monthly** reconciliation period
- Cannot have other reconciliation periods

### Transactions

Transactions are individual financial records linked to a category. Each transaction includes:
- **Amount**: The monetary value (always positive, direction determined by category type)
- **Description**: Optional notes about the transaction
- **Date**: When the transaction occurred
- **Category**: Which category it belongs to

## User Interface Guide

### Dashboard

The main dashboard shows two panels:

**Left Panel - Categories**
- Lists all your categories
- Shows category type (💰 Profit or 💳 Deficit)
- Displays reconciliation period
- Shows transaction count per category
- Click a category to filter transactions
- Click "All Categories" to show all transactions

**Right Panel - Transactions**
- Lists all transactions (or filtered by category)
- Shows amount with color coding:
  - Green (+) for profit transactions
  - Red (-) for deficit transactions
- Displays category name and optional description
- Shows transaction date
- Delete button for each transaction

### Creating a Category

1. Click the "Add Category" button
2. Enter a category name (must be unique for your account)
3. Select the type:
   - **Deficit (Spending)**: For expenses - automatically uses monthly period
   - **Profit (Income)**: For income - requires period selection
4. If Profit type selected, choose reconciliation period
5. Click "Create"

**Validation**:
- Category name is required
- Category name must be unique per user
- Deficit categories must use monthly reconciliation
- Profit categories must specify a reconciliation period

### Adding a Transaction

1. Click the "Add Transaction" button
2. Select a category from the dropdown
3. Enter the amount (positive number)
4. Add optional description
5. Set the date (defaults to today)
6. Click "Create"

**Validation**:
- Amount must be non-zero
- Category must be selected
- Category must belong to the authenticated user

### Filtering Transactions

- Click on any category in the left panel to filter transactions
- Only transactions from that category will be displayed
- Click "All Categories" to remove the filter

### Deleting Items

- **Categories**: Click the 🗑️ icon next to the category
  - ⚠️ Warning: Deleting a category also deletes all its transactions
  - Confirmation dialog will appear
  
- **Transactions**: Click the 🗑️ icon next to the transaction
  - Only deletes the single transaction
  - Confirmation dialog will appear

## Example Use Cases

### Scenario 1: Tracking Regular Income

**Setup**:
1. Create "Paycheck" category
   - Type: Profit
   - Period: Bi-weekly
2. Create "Freelance Work" category
   - Type: Profit
   - Period: One-time

**Usage**:
- Add transaction every payday to "Paycheck"
- Add transaction when receiving freelance payment to "Freelance Work"

### Scenario 2: Managing Monthly Expenses

**Setup**:
1. Create "Grocery" category (Type: Deficit)
2. Create "Utilities" category (Type: Deficit)
3. Create "Entertainment" category (Type: Deficit)

**Usage**:
- Add grocery shopping transactions weekly
- Add utility bill transactions monthly
- Add entertainment expenses as they occur
- Filter by category to see spending in each area

### Scenario 3: Annual Planning

**Setup**:
1. Create "Annual Bonus" category
   - Type: Profit
   - Period: Yearly
2. Create various deficit categories for regular expenses

**Usage**:
- Track when bonus is received
- Compare against monthly spending to plan savings

## Tips for Best Results

### Category Organization

- **Be Specific**: Create separate categories for different expense types
  - Instead of: "Bills"
  - Try: "Electric Bill", "Internet Bill", "Phone Bill"

- **Use Consistent Naming**: Establish a naming convention
  - Good: "Grocery - Weekly", "Grocery - Monthly"
  - Avoid: "groceries", "Groceries Shopping", "Food"

- **Right-Size Categories**: Not too many, not too few
  - Too many: Hard to remember which to use
  - Too few: Hard to analyze spending patterns
  - Sweet spot: 10-20 categories

### Transaction Best Practices

- **Add Descriptions**: Use the description field for context
  - Example: "Grocery - Costco", "Bills - Electric August"
  
- **Regular Updates**: Add transactions promptly
  - Don't wait until end of month
  - Add as they occur for accuracy

- **Correct Dates**: Use actual transaction date, not entry date
  - Helps with month-end reconciliation
  - Accurate historical tracking

### Financial Planning

- **Review by Category**: Click categories to see spending patterns
- **Compare Periods**: Look at transaction dates to identify trends
- **Balance Income vs Expenses**: Monitor profit vs deficit transactions

## Common Workflows

### Weekly Review
1. Add all transactions from the past week
2. Review each category's spending
3. Identify any unusual or high expenses

### Monthly Reconciliation
1. Verify all profit transactions are recorded
2. Review all deficit categories
3. Check total spending vs income
4. Plan adjustments for next month

### Budget Planning
1. Review historical transactions by category
2. Calculate average monthly spending per category
3. Set target amounts based on profit categories
4. Create new categories for budget areas

## Data Privacy & Security

- **Authentication Required**: All data is behind Google OAuth login
- **User Isolation**: You can only see your own data
- **Secure Connection**: Use HTTPS in production
- **No Data Sharing**: Your financial data is private

## Troubleshooting

### Can't Create Category
- Check if category name already exists
- Ensure you selected a valid reconciliation period for profit categories
- Verify you're logged in

### Transaction Not Appearing
- Verify the category filter is not hiding it
- Click "All Categories" to see all transactions
- Check the transaction was successfully created

### Unexpected Category Behavior
- Remember: Deficit categories always use monthly period
- Category names are case-sensitive
- Categories must have at least one character

## Future Enhancements (Potential)

While this version is complete, here are ideas for future development:
- Budget tracking and alerts
- Recurring transaction templates
- Export data to CSV/Excel
- Charts and graphs for spending analysis
- Multiple reconciliation cycles per category
- Shared categories for family accounts
- Mobile app companion

## Support

For issues or questions:
1. Check the SETUP.md file for technical setup
2. Review this guide for usage questions
3. Check the README.md for quick start information
4. Verify environment configuration is correct
