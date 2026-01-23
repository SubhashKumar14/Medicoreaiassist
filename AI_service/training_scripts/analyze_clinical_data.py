
import pandas as pd
import os
try:
    import matplotlib.pyplot as plt
except ImportError:
    plt = None

# Configuration
DATASET_PATH = os.path.join(os.path.dirname(__file__), '../datasets/ClinicalDataset/Clinical Data_Discovery_Cohort.csv')
OUTPUT_REPORT = os.path.join(os.path.dirname(__file__), '../clinical_analysis_report.txt')

def analyze_data():
    print(f"Loading clinical data from {DATASET_PATH}...")
    try:
        df = pd.read_csv(DATASET_PATH)
    except FileNotFoundError:
        print(f"Error: File not found at {DATASET_PATH}")
        return

    # Basic Cleaning
    # Based on file view: 'Event' is 1 (Dead) or 0 (Alive). 'Time' is survival time.
    # Columns: PatientID, Specimen date, Dead or Alive, Date of Death, Date of Last Follow Up, sex, race, Stage, Event, Time
    
    # Ensure numerical
    df['Time'] = pd.to_numeric(df['Time'], errors='coerce')
    df['Event'] = pd.to_numeric(df['Event'], errors='coerce')

    report_lines = []
    report_lines.append("=== Clinical Data Analysis Report ===\n")
    report_lines.append(f"Total Patients: {len(df)}")
    
    # Descriptives
    avg_survival = df['Time'].mean()
    event_rate = df['Event'].mean() * 100
    
    report_lines.append(f"Average Follow-up/Survival Time: {avg_survival:.2f} days")
    report_lines.append(f"Mortality Rate (during study): {event_rate:.2f}%")
    
    # Sex distribution
    report_lines.append("\nDistribution by Sex:")
    report_lines.append(df['sex'].value_counts().to_string())

    # Race distribution
    report_lines.append("\nDistribution by Race:")
    report_lines.append(df['race'].value_counts().to_string())
    
    # Stage distribution
    report_lines.append("\nDistribution by Stage:")
    report_lines.append(df['Stage'].value_counts().to_string())

    # Survival Analysis (Kaplan-Meier estimates - simplified manual calculation or via lib)
    # Trying lifelines if available
    try:
        from lifelines import KaplanMeierFitter
        kmf = KaplanMeierFitter()
        kmf.fit(df['Time'], event_observed=df['Event'])
        report_lines.append("\n[Lifelines] Kaplan-Meier Fit Successful.")
        report_lines.append(f"Median Survival Time: {kmf.median_survival_time_} days")
        
        # Plot
        if plt:
            plt.figure(figsize=(10, 6))
            kmf.plot_survival_function()
            plt.title('Kaplan-Meier Survival Curve')
            plt.savefig(os.path.join(os.path.dirname(__file__), '../survival_curve.png'))
            report_lines.append("Survival curve saved to ../survival_curve.png")
        else:
            report_lines.append("Matplotlib not found. Skipping plot.")
    except ImportError:
        report_lines.append("\n[Lifelines] Library not found. Skipping advanced survival analysis.")

    # Write Report
    print("\n".join(report_lines))
    with open(OUTPUT_REPORT, 'w') as f:
        f.write("\n".join(report_lines))
    print(f"\nReport saved to {OUTPUT_REPORT}")

if __name__ == "__main__":
    analyze_data()
