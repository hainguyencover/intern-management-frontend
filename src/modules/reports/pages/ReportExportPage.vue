<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <h1 class="text-h5 text-bold q-my-none text-primary">Báo cáo & Xuất dữ liệu Excel / PDF</h1>
      <p class="text-caption text-grey-7 q-mb-none">Trích xuất thống kê nguồn thực tập sinh và tỷ lệ hoàn thành chương trình</p>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Report Option Card 1 -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-bold text-primary">Báo cáo Nguồn Thực tập sinh</div>
            <div class="text-caption text-grey-7 q-mb-md">Thống kê thực tập sinh theo Trường Đại học & Ngành học</div>

            <q-select
              v-model="sourceGroupBy"
              dense
              outlined
              emit-value
              map-options
              :options="groupByOptions"
              label="Gom nhóm theo"
              class="q-mb-md"
            />

            <div class="row q-gutter-sm">
              <q-btn
                color="positive"
                icon="description"
                label="Xuất file Excel (.xlsx)"
                :loading="exportingSourceExcel"
                @click="downloadReport('intern_source', 'xlsx', sourceGroupBy)"
              />
              <q-btn
                color="negative"
                icon="picture_as_pdf"
                label="Xuất file PDF (.pdf)"
                :loading="exportingSourcePdf"
                @click="downloadReport('intern_source', 'pdf', sourceGroupBy)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Report Option Card 2 -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="fit">
          <q-card-section>
            <div class="text-h6 text-bold text-primary">Báo cáo Hoàn thành Chương trình</div>
            <div class="text-caption text-grey-7 q-mb-md">Đánh giá tỷ lệ hoàn thành đợt thực tập của các phòng ban</div>

            <q-select
              v-model="completionPeriod"
              dense
              outlined
              emit-value
              map-options
              :options="periodOptions"
              label="Kỳ đánh giá"
              class="q-mb-md"
            />

            <div class="row q-gutter-sm">
              <q-btn
                color="positive"
                icon="description"
                label="Xuất file Excel (.xlsx)"
                :loading="exportingCompExcel"
                @click="downloadReport('program_completion', 'xlsx', undefined, completionPeriod)"
              />
              <q-btn
                color="negative"
                icon="picture_as_pdf"
                label="Xuất file PDF (.pdf)"
                :loading="exportingCompPdf"
                @click="downloadReport('program_completion', 'pdf', undefined, completionPeriod)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { apiClient as api } from '../../../shared/api/client';

const $q = useQuasar();

const sourceGroupBy = ref('university');
const completionPeriod = ref('FINAL');

const exportingSourceExcel = ref(false);
const exportingSourcePdf = ref(false);
const exportingCompExcel = ref(false);
const exportingCompPdf = ref(false);

const groupByOptions = [
  { label: 'Theo Trường Đại học', value: 'university' },
  { label: 'Theo Chuyên ngành', value: 'major' },
  { label: 'Trường & Chuyên ngành', value: 'university_major' }
];

const periodOptions = [
  { label: 'Đánh giá Cuối kỳ (FINAL)', value: 'FINAL' },
  { label: 'Đánh giá Giữa kỳ (MIDTERM)', value: 'MIDTERM' }
];

async function downloadReport(report: string, format: string, groupBy?: string, period?: string) {
  try {
    const res = await api.get('/api/v1/hr/exports', {
      params: { report, format, groupBy, period },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report}_report.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    $q.notify({ type: 'positive', message: 'Xuất báo cáo thành công' });
  } catch (err: any) {
    $q.notify({ type: 'negative', message: 'Không thể tải báo cáo. Hãy kiểm tra quyền HR/Admin' });
  }
}
</script>
