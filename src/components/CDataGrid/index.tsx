import { useMemo } from 'react';
import DataGrid, {
  Column,
  // ColumnChooser,
  Toolbar,
  Item,
  // Position,
  StateStoring,
  Scrolling,
  FilterRow,
  Paging,
  Pager,
  Selection,
  Editing,
  ColumnChooser,
  Position,
  ColumnChooserSearch,
  ColumnChooserSelection,
  Summary,
} from 'devextreme-react/data-grid';
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getEncryptModuleData } from '../../utils/general';
import { searchEditorOptions, columnChooserModes } from '../../db';
import { columnChooserConfig } from '../../db/Configs';
import { CDataGridProps } from '../../dbProps';
import ButtonIcon from '../ButtonIcon';
import ToolbarButton from '../ToolbarButton';
import UploadOutlined from '../../assets/svg/UploadOutlined.svg?react';
import PlusOutlined from '../../assets/svg/PlusOutlined.svg?react';
import ReloadOutlined from '../../assets/svg/ReloadOutlined.svg?react';
import LuRefresh from '../../assets/svg/LuRefresh.svg?react';
import ExcelExportIcon from '../../assets/svg/ExcelExportIcon.svg?react';
import styles from './styles.module.scss';
dayjs.extend(utc);

const CDataGrid: React.FC<CDataGridProps> = ({
  children,
  gridKey,
  data,
  refSource,
  height = '80vh',
  columns,
  stateStore,
  handleOpenEditModal,
  handleOpenDeleteModal,
  handleOpenModal,
  handleOpenChangePasswordModal,
  handleAssignSpa,
  handleRefresh,
  handleImport,
  handleSave,
  handleExportExcel,
  handleActiveButton,
  handleSelectRow,
  handleDeleteRow,
  handleReset,
  handleLogs,
  selectedRowKeys = [],
  onSelectionChanged,
  selectButtonVisible = false,
  addLogicVisible = true,
  excelExportVisible = false,
  editButtonVisible = true,
  changePasswordButtonVisible = false,
  deleteButtonVisible = true,
  deleteVisible = false,
  resetVisible = false,
  logsVisible = false,
  editLogsVisible = false,
  handleEditLogs,
  columnChooserButtonVisible = false,
  toolbarVisible = true,
  assignSpaVisible = false,
  refreshVisible = false,
  multiselect = false,
  allowColumnResizing = true,
  allowSorting = true,
  // linkToVisible = false,
  saveVisible = false,
  allowEditing = false,
  loadPanel = false,
  activeButtonVisible = false,
  linkTo,
  importButtonVisible = false,
  remoteOperations = false,
  customMenuItems,
  onRowPrepared,
  onCellClick,
  onCellPrepared,
  onRowUpdating,
  className,
  columnFilter = false,
  renderingMode = 'virtual',
  scrollingMode = 'virtual',
  paging = false,
  pageSize,
  pTitle = '',
  handleEnable,
  handleStatusChange,
  handleUploadModal,
  summary,
}) => {
  const { t } = useTranslation();
  const perData = useMemo(() => getEncryptModuleData(), []);
  const pScore = perData?.find((item: any) => item.moduleName === pTitle)?.permissionScore;
  const createTrue = new Set([3, 6, 7, 10]).has(pScore);
  const editTrue = new Set([4, 6, 8, 10]).has(pScore);
  const deleteTrue = new Set([5, 7, 8, 10]).has(pScore);
  const resetTrue = new Set([4, 6, 8, 10]).has(pScore);
  const logsTrue = new Set([1, 3, 4, 5, 6, 7, 8, 9, 10]).has(pScore);

  return (
    <div className={styles['c-datagrid']}>
      <DataGrid
        ref={refSource}
        cacheEnabled={false}
        dataSource={data}
        repaintChangesOnly={true}
        showBorders={true}
        showRowLines={true}
        rowAlternationEnabled={true}
        remoteOperations={remoteOperations}
        height={height}
        style={{ overflow: 'auto' }}
        allowColumnResizing={allowColumnResizing}
        onContextMenuPreparing={customMenuItems}
        onRowPrepared={onRowPrepared}
        onCellClick={onCellClick}
        onRowUpdating={onRowUpdating}
        onCellPrepared={onCellPrepared}
        className={className}
        loadPanel={{ enabled: loadPanel, text: '' }}
        selectedRowKeys={selectedRowKeys}
        onSelectionChanged={onSelectionChanged}>
        {multiselect && <Selection mode='multiple' selectAllMode={'allPages'} showCheckBoxesMode={'always'} selectByClick={true} />}
        {allowEditing && <Editing mode='cell' allowDeleting={false} allowUpdating={true} startEditAction='dblClick' useIcons={false} selectTextOnEditStart={false} allowAdding={false} />}
        <FilterRow visible={columnFilter} />
        {columns?.map((column) => (
          <Column
            dataType={column.dataType}
            alignment={column.addition?.alignment ? column.addition.alignment : 'left'}
            key={column.dataField}
            dataField={column.dataField}
            caption={t(column.caption)}
            allowSorting={allowSorting}
            {...column.addition}
            {...(column.addition && column.addition.minWidth ? column.addition.minWidth : { minWidth: 50 })}
            cellRender={column.cellRender && column.cellRender}
          />
        ))}
        {handleEnable && editTrue && (
          <Column
            cellRender={(cellData) => (
              <Switch
                className={
                  cellData.data.status === 1 || cellData.data.status === true ? `${styles['c-datagrid__enabledButton']} ${styles['on']}` : `${styles['c-datagrid__enabledButton']} ${styles['off']}`
                }
                checked={cellData.data.status === 1 || cellData.data.status === true ? true : false}
                onChange={() => handleEnable && handleEnable(cellData?.data)}
                value={cellData.data.status === 1 || cellData.data.status === true ? true : false}
              />
            )}
            alignment='center'
            caption={t('status')}
            width={125}
            allowHiding={false}
          />
        )}
        {handleStatusChange && editTrue && (
          <Column
            cellRender={(cellData) => (
              <Switch
                className={cellData.data.status === 2 ? `${styles['c-datagrid__enabledButton']} ${styles['on']}` : `${styles['c-datagrid__enabledButton']} ${styles['off']}`}
                checked={cellData.data.status === 2 ? true : false}
                onChange={() => handleStatusChange && handleStatusChange(cellData?.data)}
                value={cellData.data.status === 2 ? true : false}
              />
            )}
            alignment='center'
            caption={t('status')}
            width={125}
            allowHiding={false}
          />
        )}
        {(editButtonVisible || deleteButtonVisible || deleteVisible || selectButtonVisible || resetVisible || logsVisible || linkTo || handleOpenChangePasswordModal) && (
          <Column
            alignment='center'
            caption={t('actions')}
            type={'buttons'}
            minWidth={75}
            allowHiding={false}
            buttons={[
              {
                text: t('select'),
                cssClass: 'select-button-a',
                onClick: function (e) {
                  handleSelectRow && handleSelectRow(e.row?.data);
                },
                visible: selectButtonVisible,
              },
              {
                text: t('delete'),
                cssClass: 'delete-button-a',
                onClick: function (e) {
                  handleDeleteRow && handleDeleteRow(e.row?.data);
                },
                visible: deleteVisible && deleteTrue,
              },
              {
                text: t('reset'),
                cssClass: 'reset-button-a',
                onClick: function (e) {
                  handleReset && handleReset(e.row?.data);
                },
                visible: resetVisible && resetTrue,
              },
              {
                text: t('logs'),
                cssClass: 'logs-button-a',
                onClick: function (e) {
                  handleLogs && handleLogs(e.row?.data);
                },
                visible: logsVisible && logsTrue,
              },
              {
                text: t('edit'),
                cssClass: 'edit-logs-button-a',
                onClick: function (e) {
                  handleEditLogs && handleEditLogs(e.row?.data);
                },
                visible: function (e: any) {
                  if (typeof editLogsVisible === 'function') {
                    return editLogsVisible(e.row?.data) && deleteTrue;
                  }
                  return editLogsVisible && deleteTrue;
                },
              },
              {
                text: t('active'),
                icon: 'lock',
                onClick: function (e) {
                  handleActiveButton && handleActiveButton(e.row?.data);
                },
                visible: activeButtonVisible && editTrue,
              },
              {
                text: t('edit'),
                icon: 'edit',
                onClick: function (e) {
                  handleOpenEditModal && handleOpenEditModal(e.row?.data);
                },
                visible: function (e: any) {
                  return typeof editButtonVisible === 'function' ? editButtonVisible(e.row?.data) && editTrue : editButtonVisible && editTrue;
                },
              },
              {
                text: t('save'),
                icon: 'save',
                onClick: function (e) {
                  handleSave && handleSave(e.row?.data);
                },
                visible: saveVisible && editTrue,
              },
              {
                text: t('assign'),
                icon: 'redo',
                onClick: function (e) {
                  handleAssignSpa && handleAssignSpa(e.row?.data);
                },
                visible: assignSpaVisible && editTrue,
              },
              {
                text: t('delete'),
                icon: 'trash',
                onClick: function (e) {
                  handleOpenDeleteModal && handleOpenDeleteModal(e.row?.data);
                },
                visible: deleteButtonVisible && deleteTrue,
              },
              {
                text: t('lock'),
                icon: 'lock',
                onClick: function (e) {
                  handleOpenChangePasswordModal && handleOpenChangePasswordModal(e.row?.data);
                },
                visible: changePasswordButtonVisible && editTrue,
              },
              {
                text: t('go_to'),
                icon: 'chevrondoubleright',
                onClick: function (e) {
                  linkTo && linkTo(e.row?.data);
                },
                visible: linkTo ? true : false,
              },
            ]}
          />
        )}

        <Paging enabled={paging} defaultPageSize={pageSize || 100} />
        <Pager visible={paging} displayMode='full' showPageSizeSelector={false} showInfo={true} showNavigationButtons={true} />
        <Scrolling rowRenderingMode={renderingMode} columnRenderingMode={renderingMode} mode={scrollingMode} />
        <ColumnChooser enabled={columnChooserButtonVisible} height='340px' mode={columnChooserModes[1].key}>
          <Position my='right top' at='right bottom' of='.dx-datagrid-column-chooser-button' />
          <ColumnChooserSearch enabled={columnChooserConfig.searchEnabled} editorOptions={searchEditorOptions} />
          <ColumnChooserSelection allowSelectAll={true} selectByClick={true} recursive={true} />
        </ColumnChooser>
        <Summary recalculateWhileEditing={true} />
        <Toolbar visible={toolbarVisible}>
          {handleUploadModal && (
            <Item location='after'>
              <ButtonIcon title='upload' icon={<UploadOutlined />} handleClick={handleUploadModal} />
            </Item>
          )}
          {importButtonVisible && (
            <Item location='after'>
              <ButtonIcon title='import' icon={<LuRefresh />} handleClick={handleImport} />
            </Item>
          )}
          {refreshVisible && (
            <Item location='after'>
              <ButtonIcon title='refresh' icon={<ReloadOutlined />} handleClick={handleRefresh} />
            </Item>
          )}
          {createTrue && addLogicVisible && (
            <Item location='after'>
              <ButtonIcon title='add' icon={<PlusOutlined />} handleClick={handleOpenModal} />
            </Item>
          )}
          {excelExportVisible && (
            <Item location='after'>
              <ToolbarButton title='export' icon={<ExcelExportIcon />} handleClick={handleExportExcel} />
            </Item>
          )}
          <Item name='columnChooserButton' cssClass='column-chooser-button' />
        </Toolbar>
        <StateStoring enabled={stateStore !== 'NO'} type='localStorage' storageKey={'storage-' + gridKey} />
        {summary && <Summary {...summary} />}
        {children}
      </DataGrid>
    </div>
  );
};
export default CDataGrid;
