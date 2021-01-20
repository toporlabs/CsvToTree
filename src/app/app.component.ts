import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rows = [];
  html = '';

  changeListener(files: FileList): void {
    if (files && files.length > 0) {
      this.rows = [];
      this.html = '';
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: any = reader.result;
        const allTextLines = csv.split(/\r|\n|\r/);

        for (const item of allTextLines) {
          if (item.length > 0) {
            this.rows.push(item.split(';'));
          }
        }

        const headers = this.rows.shift();
        const columnsCount = headers.length;
        const arr = [];

        for (let k = 0; k < this.rows.length; k++) {
          if (!arr[k]) { arr[k] = []; }
          for (let j = 0; j < columnsCount; j++) {
            const row = this.rows[k][j];
            if (row) {
              const prevRow = this.rows[k][j - 1];
              if (!prevRow) {
                if (j === 0) {
                  arr[k][j] = [row];
                } else {
                  const key = this.getLastNotEmptyRow(arr, (k - 1));
                  this.getLastArr(arr[key]).push(row);
                }
              } else {
                let isOk = false;
                for (let q = (j - 1); q >= 0; q--) {
                  if (arr[k][q] && arr[k][q].length > 0) {
                    this.getLastArr(arr[k][q]).push([row]);
                    q = -1;
                    isOk = true;
                  }
                }
                if (!isOk) {
                  const key = this.getLastNotEmptyRow(arr, (k - 1));
                  this.getLastArr(arr[key]).push([row]);
                }
              }
            }
          }
        }

        arr.forEach(item => {
          this.printNode(item);
        });

        document.getElementById('tree').innerHTML = this.html;
      };
    }
  }

  printNode(arr): void {
    this.html += '<ul>';
    for (const item of arr) {
      if (!Array.isArray(item)){
          this.html += '<li>';
          this.html += item;
          this.html += '</li>';
      } else {
        this.printNode(item);
      }
    }
    this.html += '</ul>';
  }

  isLastNotArrayElement(arr, i): boolean {
    let j = 0;
    for (let k = 0; k < arr.length; k++) {
      if (!Array.isArray(arr[k])) {
        j = k;
      }
    }

    return j === i;
  }

  getLastArr(arr): any[] {
    for (let i = arr.length; i >= 0; i--) {
      if (Array.isArray(arr[i]) && arr[i].length > 0) {
        return this.getLastArr(arr[i]);
      }
    }

    return arr;
  }

  getLastNotEmptyRow(arr, key: number): number {
    for (let i = key; i >= 0; i--) {
      for (let j = arr[i].length; j >= 0; j--) {
        if (arr[i][j] && arr[i][j].length > 0) {
          return i;
        }
      }
    }
  }
}
