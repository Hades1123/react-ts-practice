import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, TableProps } from 'antd';
import { App, Modal, Upload, Table } from 'antd';
import { useState } from 'react';
import { Buffer } from 'buffer';
import excel from 'exceljs'

interface IProps {
	isOpenImportModal: boolean;
	setIsOpenImportModal: (v: boolean) => void;
}

interface IDataImport {
	fullName: string;
	email: string;
	phone: string;
}

const { Dragger } = Upload;

const ImportUser = (props: IProps) => {
	const { isOpenImportModal, setIsOpenImportModal } = props
	const [importData, setImportData] = useState<IDataImport[]>([]);
	const columns: TableProps<IDataImport>['columns'] = [
		{
			title: 'Full Name',
			dataIndex: 'fullName',
			key: 'fullName',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			key: 'phone',
		},
	];
	const { message } = App.useApp();

	const propsUpload: UploadProps = {
		maxCount: 1,
		accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		name: 'file',
		multiple: false,
		customRequest({ file, onSuccess }) {
			setTimeout(() => {
				if (onSuccess) onSuccess("ok");
			}, 1000);
		},
		async onChange(info) {
			const { status } = info.file;
			console.log(info)
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
				message.success(`${info.file.name} file uploaded successfully.`);
				if (info.fileList && info.fileList.length > 0) {
					const file = info.fileList[0].originFileObj;
					// Convert js file to excel file
					const arrayBuffer = await file?.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer!);
					// Conver excel file to Json object
					const workbook = new excel.Workbook();
					// use readFile for testing purpose
					await workbook.xlsx.load(buffer);
					let jsonData: any = [];
					workbook.worksheets.forEach(function (sheet) {
						// read first row as data keys
						let firstRow = sheet.getRow(1);
						if (!firstRow.cellCount) return;
						let keys: any = firstRow.values;
						sheet.eachRow((row, rowNumber) => {
							if (rowNumber == 1) return;
							let values: any = row.values
							let obj: any = {};
							for (let i = 1; i < keys.length; i++) {
								obj[keys[i]] = values[i];
							}
							jsonData.push(obj);
						})

					});
					setImportData(jsonData);
				}
			} else if (status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};
	const onCancelModal = () => {
		setImportData([]);
		setIsOpenImportModal(false);
	}
	return (
		<Modal
			title="Import data user"
			closable={{ 'aria-label': 'Custom Close Button' }}
			open={isOpenImportModal}
			onOk={() => setIsOpenImportModal(false)}
			onCancel={onCancelModal}
			width={800}
			maskClosable={false}
			okText={'Import data'}
			okButtonProps={{
				disabled: importData.length > 0,
			}}
			destroyOnClose={true}
		>
			<Dragger {...propsUpload}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag file to this area to upload</p>
				<p className="ant-upload-hint">
					Support for a single support. Only accept .csv, .xls, .xlsx
				</p>
			</Dragger>
			<Table columns={columns} className='pt-5' dataSource={importData!} rowKey={"email"} />
		</Modal >
	);
}
export default ImportUser;