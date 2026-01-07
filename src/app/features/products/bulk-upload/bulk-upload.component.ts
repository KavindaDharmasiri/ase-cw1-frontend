import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h1>📤 Bulk Product Upload</h1>
      
      <div class="upload-card">
        <div class="upload-section">
          <div class="file-input-wrapper">
            <input type="file" #fileInput (change)="onFileSelected($event)" accept=".csv" class="file-input">
            <button (click)="fileInput.click()" class="btn-select-file">
              📁 Select CSV File
            </button>
          </div>
          
          <div *ngIf="selectedFile" class="file-info">
            <p><strong>Selected:</strong> {{selectedFile.name}}</p>
            <p><strong>Size:</strong> {{formatFileSize(selectedFile.size)}}</p>
          </div>
          
          <button (click)="uploadFile()" [disabled]="!selectedFile || uploading" class="btn-upload">
            <span *ngIf="uploading">⏳ Uploading...</span>
            <span *ngIf="!uploading">🚀 Upload Products</span>
          </button>
        </div>
        
        <div *ngIf="uploadResult" class="upload-result">
          <h3>Upload Results</h3>
          <div class="result-stats">
            <div class="stat success">
              <span class="count">{{uploadResult.successCount}}</span>
              <span class="label">Success</span>
            </div>
            <div class="stat error">
              <span class="count">{{uploadResult.errorCount}}</span>
              <span class="label">Errors</span>
            </div>
          </div>
          
          <div *ngIf="uploadResult.errors?.length > 0" class="error-list">
            <h4>Errors:</h4>
            <ul>
              <li *ngFor="let error of uploadResult.errors">{{error}}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="sample-section">
        <h3>Sample CSV Format</h3>
        <div class="sample-csv">
          <pre>name,description,category,price,unit,minStockLevel
Rice 5kg,Premium Basmati Rice,Grains,25.99,kg,50
Milk 1L,Fresh Dairy Milk,Dairy,3.50,liter,100</pre>
        </div>
        <button (click)="downloadSample()" class="btn-download">
          💾 Download Sample CSV
        </button>
      </div>
    </div>
  `,
  styles: [`
    .upload-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .upload-card, .sample-section { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px; }
    .upload-section { margin: 30px 0; text-align: center; }
    .file-input-wrapper { margin-bottom: 20px; }
    .file-input { display: none; }
    .btn-select-file, .btn-upload, .btn-download { padding: 12px 24px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; margin: 10px; }
    .btn-select-file { background: #6b7280; color: white; }
    .btn-upload { background: #059669; color: white; }
    .btn-upload:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-download { background: #3b82f6; color: white; }
    .file-info { margin: 15px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
    .upload-result { margin-top: 30px; }
    .result-stats { display: flex; gap: 20px; justify-content: center; margin: 20px 0; }
    .stat { text-align: center; padding: 20px; border-radius: 8px; }
    .stat.success { background: #d1fae5; color: #065f46; }
    .stat.error { background: #fee2e2; color: #991b1b; }
    .stat .count { display: block; font-size: 24px; font-weight: bold; }
    .stat .label { font-size: 14px; }
    .error-list { margin-top: 20px; text-align: left; }
    .error-list ul { max-height: 200px; overflow-y: auto; }
    .sample-csv { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; overflow-x: auto; }
    .sample-csv pre { margin: 0; font-size: 12px; }
  `]
})
export class BulkUploadComponent {
  selectedFile: File | null = null;
  uploading = false;
  uploadResult: any = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadResult = null;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:5000/api/products/bulk-upload', formData).subscribe({
      next: (result: any) => {
        this.uploadResult = result;
        this.uploading = false;
        
        if (result.errorCount === 0) {
          Swal.fire('Success!', `${result.successCount} products uploaded successfully`, 'success');
        } else {
          Swal.fire('Partial Success', `${result.successCount} products uploaded, ${result.errorCount} errors`, 'warning');
        }
      },
      error: (error) => {
        this.uploading = false;
        Swal.fire('Error!', error.error || 'Upload failed', 'error');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadSample() {
    const csvContent = `name,description,category,price,unit,minStockLevel
Rice 5kg,Premium Basmati Rice,Grains,25.99,kg,50
Milk 1L,Fresh Dairy Milk,Dairy,3.50,liter,100
Bread,Whole Wheat Bread,Bakery,2.25,loaf,20`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}