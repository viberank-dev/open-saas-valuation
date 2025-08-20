# SaaS Valuation App

A comprehensive React application for calculating early-stage app valuations based on multiple factors including revenue, user traction, development costs, and growth metrics.

## Features

- **Multiple Valuation Methods**: 
  - Revenue-based valuation using industry multiples
  - User-based valuation by app type
  - Cost-based valuation considering development time
  - Social media value assessment

- **Comprehensive Input Categories**:
  - Financial metrics (MRR, MRP)
  - Development metrics (hours per week, country rates)
  - Timeline tracking (start date, launch date)
  - User traction metrics
  - Social media followers
  - App classification and growth rates

- **Smart Analytics**:
  - Growth multipliers for high-performing apps
  - Risk adjustments for early-stage companies
  - Industry-specific user value calculations
  - Country-specific hourly rate adjustments

- **Professional UI**:
  - Dark/light mode support
  - Responsive design
  - Modern Tailwind CSS styling
  - Interactive form validation

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd saas-valuation-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To build the application for production:

```bash
npm run build
```
or
```bash
yarn build
```

The built files will be in the `dist` directory.

## Usage

### Input Fields

1. **Financial Metrics**:
   - **MRR (Monthly Recurring Revenue)**: Your app's monthly subscription revenue
   - **MRP (Monthly Recurring Profit)**: Net profit after expenses

2. **Development Metrics**:
   - **Country**: Location for hourly rate calculations

3. **Timeline**:
   - **Started Building**: When development began
   - **Launch Date**: When the app went live

4. **User Traction**:
   - **Unique Visitors/Month**: Monthly website/app visitors
   - **Registrations/Month**: New user sign-ups monthly

5. **Social Media**:
   - Follower counts across LinkedIn, X (Twitter), and Reddit

6. **App Classification**:
   - **App Type**: Category (B2B SaaS, Gaming, E-commerce, etc.)
   - **Growth Rate**: Year-over-year growth percentage

### Valuation Methods

The calculator uses four primary valuation methods:

1. **Revenue-Based**: Multiplies Annual Recurring Revenue (ARR) by industry-standard multiples based on growth rate
2. **User-Based**: Values active and projected users based on app type
3. **Cost-Based**: Calculates replacement cost using development hours and country-specific rates
4. **Social Media**: Assigns monetary value to social media following

### Results Interpretation

The calculator provides:
- **Valuation Range**: Low, average, and high estimates
- **Primary Method**: The most applicable valuation method for your app
- **Method Breakdown**: Detailed calculations for each approach
- **Key Insights**: Analysis of your app's strengths and areas for improvement
- **Recommendations**: Strategic advice based on the valuation results

## Valuation Methodology

### Country Hourly Rates

The app includes hourly development rates for 25+ countries, ranging from $15/hour (India) to $60/hour (UK).

### User Values by App Type

- **B2B SaaS**: $12-20 per user (avg $16)
- **E-commerce**: $15-25 per user (avg $20)
- **Productivity**: $10-15 per user (avg $12.5)
- **Gaming**: $5-8 per user (avg $6.5)
- **Social Networking**: $8-12 per user (avg $10)
- **Content**: $6-10 per user (avg $8)

### Revenue Multiples

- **High Growth (>40% YoY)**: 7-10x ARR (avg 8.5x)
- **Moderate Growth (20-40% YoY)**: 5-7x ARR (avg 6x)
- **Low Growth (<20% YoY)**: 3-5x ARR (avg 4x)
- **Unknown Growth**: 4-6x ARR (avg 5x)

### Growth Multipliers

The calculator applies growth multipliers for:
- Recently launched apps with strong traction
- High revenue growth rates
- Strong user acquisition rates

### Risk Adjustments

- Early-stage apps (< 3 months in market) receive a 15% risk discount
- Valuations are bounded by development costs to ensure realistic estimates

## Important Disclaimer

This valuation calculator provides estimates based on industry benchmarks and should not be considered professional financial advice. Actual app valuations can vary significantly based on:

- Market conditions
- Competitive landscape
- Team experience
- Technology differentiation
- Customer retention rates
- Revenue quality and predictability

Always consult with qualified financial professionals for investment decisions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

